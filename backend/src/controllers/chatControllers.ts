import { Request, Response } from "express";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import { getSocketId, io } from "../config/socket.js";
import cloudinary from "../config/cloudinary.js";

const MAX_MEMBERS_GROUP_CHAT = 10;

export const getUserChats = async (req: Request, res: Response) => {
  const userId = req.user!._id;

  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      })
      .sort({ updatedAt: -1 }); // get latest first

    return res.json({
      success: true,
      message: "Chats successfully fetched",
      chats,
    });
  } catch (error) {
    console.error("Error fetching chats", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getChatDetails = async (req: Request, res: Response) => {
  const { chatId: id } = req.params;

  try {
    const chat = await Chat.findById(id);
    return res.json({
      success: true,
      message: "Chat details found successfully.",
      chat,
    });
  } catch (error) {
    console.error("Error fetching chat details", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const createChat = async (req: Request, res: Response) => {
  const { email } = req.body;
  const userId = req.user!._id;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Other user's email not provided." });
  }

  // Check if user is trying to add their own email as a contact.
  if (email === req.user?.email) {
    return res.status(400).json({
      success: false,
      message: "You can’t add yourself as a contact.",
    });
  }

  try {
    // Find the other user by email
    const otherUser = await User.findOne({ email });
    if (!otherUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const otherUserId = otherUser._id;

    // Check if a one-on-one chat already exists
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [userId, otherUserId] },
    });

    if (existingChat) {
      return res
        .status(409)
        .json({ success: false, message: "Chat already created." });
    }

    // Create a new one-on-one chat
    const newChat = await Chat.create({
      isGroupChat: false,
      users: [userId, otherUserId],
      unread: [userId, otherUserId].map((id) => ({
        user: id,
        unread: 0,
      })),
    });

    const chat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );

    // Emit a socket event to the other user to add the chat
    const receiverSocketId = getSocketId(otherUserId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newChat", chat);
    }

    return res
      .status(201)
      .json({ success: true, message: "Contact created successfully.", chat });
  } catch (error) {
    console.error("Error creating one-on-one chat", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const createGroupChat = async (req: Request, res: Response) => {
  const { name, emails } = req.body;
  const userId = req.user!._id;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Group chat name not provided.",
    });
  }

  // Check if emails is valid
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({
      success: false,
      message: "A list of user emails must be provided.",
    });
  }

  // Check if the emails array more than max num
  if (emails.length >= MAX_MEMBERS_GROUP_CHAT - 1) {
    return res.status(400).json({
      success: false,
      message: `Group chat cannot have more than ${MAX_MEMBERS_GROUP_CHAT} people (including creator).`,
    });
  }

  // Check if user is trying to add their own email as a contact.
  if (emails.includes(req.user?.email)) {
    return res.status(400).json({
      success: false,
      message: "You can’t add yourself into the group chat.",
    });
  }

  try {
    // Find all users by their emails
    const foundUsers = await User.find({ email: { $in: emails } });

    if (foundUsers.length !== emails.length) {
      return res.status(404).json({
        success: false,
        message: "One or more users not found.",
      });
    }

    const otherUserIds = foundUsers.map((u) => u._id);
    const allUserIds = [userId, ...otherUserIds];

    // Create a new group chat
    const newChat = await Chat.create({
      chatName: name.trim(),
      isGroupChat: true,
      users: [userId, ...otherUserIds],
      groupAdmin: userId,
      unread: allUserIds.map((id) => ({
        user: id,
        count: 0,
      })),
    });

    const chat = await Chat.findById(newChat._id)
      .populate("groupAdmin", "-password")
      .populate("users", "-password");

    // Emit socket event
    foundUsers.forEach((user) => {
      const id = user._id;
      if (!id.equals(userId)) {
        const receiverSocketId = getSocketId(id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newChat", chat);
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Group chat created successfully.",
      chat,
    });
  } catch (error) {
    console.error("Error creating group chat", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const updateGroupChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { name, emails } = req.body;
  const userId = req.user?._id;

  if (!name && (!emails || !Array.isArray(emails) || emails.length === 0)) {
    return res.status(400).json({
      success: false,
      message: "No valid updates provided. Include a new name or user emails.",
    });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found." });
    }

    if (!chat.isGroupChat) {
      return res
        .status(400)
        .json({ success: false, message: "Chat is not a group chat." });
    }

    if (!chat.groupAdmin?.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Only group admins can update the group chat.",
      });
    }

    // Handle name change
    if (name) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Chat name cannot be empty or only spaces.",
        });
      }
      chat.chatName = trimmedName;
    }

    // Handle add new users
    if (emails) {
      // Check how many users already in group chat
      if (emails.length + chat.users.length >= MAX_MEMBERS_GROUP_CHAT - 1) {
        return res.status(400).json({
          success: false,
          message: `Group chat cannot have more than ${MAX_MEMBERS_GROUP_CHAT} people (including creator).`,
        });
      }

      // Check if user is trying to add their own email as a contact.
      if (emails.includes(req.user?.email)) {
        return res.status(400).json({
          success: false,
          message: "You can’t add yourself into the group chat.",
        });
      }

      // Find all users by their emails
      const foundUsers = await User.find({ email: { $in: emails } });

      if (foundUsers.length !== emails.length) {
        return res.status(404).json({
          success: false,
          message: "One or more users not found.",
        });
      }

      const newUserIds = foundUsers.map((u) => u._id);

      // Check for duplicate IDs
      const duplicates = newUserIds.filter((id) => chat.users.includes(id));

      if (duplicates.length > 0) {
        return res.status(400).json({
          success: false,
          message: "One or more users are already in the group chat.",
        });
      }

      newUserIds.forEach((id) => {
        chat.users.push(id);
        chat.unread.push({ user: id, count: 0 });
      });
    }

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("groupAdmin", "-password")
      .populate("users", "-password");

    // Send web socket event
    chat.users.forEach((user) => {
      if (!user.equals(userId)) {
        const receiverSocketId = getSocketId(user.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("updatedChat", updatedChat);
        }
      }
    });

    return res.json({
      success: true,
      message: "Group chat successfully updated",
      chat: updatedChat,
    });
  } catch (error) {
    console.error("Error updating group chat", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const removeGroupChatUser = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { email } = req.body;
  const userId = req.user?._id;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email not provided." });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found." });
    }

    if (!chat.isGroupChat) {
      return res
        .status(400)
        .json({ success: false, message: "Chat is not a group chat." });
    }

    // Check if user exists
    const userToRemove = await User.findOne({ email });
    if (!userToRemove) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the user is in the chat
    const isMember = chat.users.some((u) => u.equals(userToRemove._id));
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this group chat.",
      });
    }

    // --- Permission logic ---
    const isAdmin = chat.groupAdmin?.equals(userId);
    const isSelf = userToRemove._id.equals(userId);

    // Only admin can remove others; non-admin can only remove themselves
    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message:
          "Only the group admin can remove other users. You can only leave the group yourself.",
      });
    }

    // Prevent admin from removing themselves
    if (isAdmin && isSelf) {
      return res.status(400).json({
        success: false,
        message: "Group admin cannot remove themselves.",
      });
    }

    // Remove the user from the group
    chat.users = chat.users.filter((u) => !u.equals(userToRemove._id));
    chat.unread.pull({ user: userId });

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("groupAdmin", "-password")
      .populate("users", "-password");

    // Send web socket event to update chat
    chat.users.forEach((user) => {
      if (!user.equals(userId)) {
        const receiverSocketId = getSocketId(user.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("updatedChat", updatedChat);
        }
      }
    });

    // Send web socket event to remove chat from deleted user's chat list
    const deletedUserSocketId = getSocketId(userToRemove._id.toString());
    if (deletedUserSocketId) {
      io.to(deletedUserSocketId).emit("removeChat", {
        chatId: updatedChat?._id,
      });
    }

    return res.json({
      success: true,
      message: `${userToRemove.email} was removed from group chat.`,
      chat: updatedChat,
    });
  } catch (error) {
    console.error("Error updating group chat", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const updateGroupChatImage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { image } = req.body;
  const userId = req.user!._id;

  // Check if avatar is provided
  if (!image) {
    return res
      .status(400)
      .json({ success: false, message: "Image not provided." });
  }

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found." });
    }

    if (!chat.isGroupChat) {
      return res
        .status(400)
        .json({ success: false, message: "Chat is not a group chat." });
    }

    if (!chat?.groupAdmin?.equals(userId)) {
      return res.status(400).json({
        success: false,
        message: "Only group admins can change the group chat image.",
      });
    }

    // Upload to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "linkup/group-chat-images",
      public_id: `${chatId}-image`,
      overwrite: true,
    });

    // Update DB with cloudinary url
    chat.image = uploadResponse.secure_url;

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("groupAdmin", "-password")
      .populate("users", "-password");

    // Send web socket event to update chat
    chat.users.forEach((user) => {
      if (!user.equals(userId)) {
        const receiverSocketId = getSocketId(user.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("updatedChat", updatedChat);
        }
      }
    });

    return res.json({
      success: true,
      message: `Chat image has been successfully updated.`,
      chat: updatedChat,
    });
  } catch (error) {
    console.error("Error with updating avatar", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const viewChat = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(400)
        .json({ success: false, message: "Chat not found." });
    }

    if (chat.activeUsers.includes(userId)) {
      return res
        .status(409)
        .json({ success: false, message: "User already active in this chat." });
    }

    chat.activeUsers = [...chat.activeUsers, userId];

    await chat.save();

    return res.json({ success: true, message: "User now viewing chat." });
  } catch (error) {
    console.error("Error setting user to view chat", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const unViewChat = async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res
        .status(400)
        .json({ success: false, message: "Chat not found." });
    }

    chat.activeUsers = chat.activeUsers.filter((id) => !id.equals(userId));

    await chat.save();

    return res.json({ success: true, message: "User now not viewing chat." });
  } catch (error) {
    console.error("Error setting user to unview chat", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
