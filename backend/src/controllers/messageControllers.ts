import { Request, Response } from "express";
import Message from "../models/Message.js";
import cloudinary from "../config/cloudinary.js";
import { getSocketId, io } from "../config/socket.js";
import Chat from "../models/Chat.js";

export const getMessages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!._id;

  // Check if other chat ID is provided
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Chat ID not provided." });
  }

  try {
    const chat = await Chat.findById(id);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found." });
    }

    if (!chat.users.some((user) => user.equals(userId))) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const messages = await Message.find({ chat: id })
      .populate("sender", "-password")
      .sort({ createdAt: 1 });

    let entry = chat.unread.find((pair) => pair.user?.equals(userId));
    if (entry) {
      entry.count = 0;
    } else {
      chat.unread.push({ user: userId, count: 0 });
    }

    await chat.save();

    return res.json({ success: true, message: "Messages found.", messages });
  } catch (error) {
    console.error("Error with fetching messages", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { id: chatId } = req.params;
  const { text, image } = req.body;

  // Check if chat ID is provided
  if (!chatId) {
    return res
      .status(400)
      .json({ success: false, message: "Chat ID not provided." });
  }

  try {
    const userId = req.user!._id;

    const chat = await Chat.findById(chatId).populate("users", "_id");

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found." });
    }

    if (!chat.users.some((user) => user.equals(userId))) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    let imageUrl;

    // Upload image to cloudinary if present
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "linkup/message-images",
      });
      imageUrl = uploadResponse.secure_url;
    }

    // Create new message
    const newMessage = new Message({
      sender: userId,
      chat: chatId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save();

    await newMessage.populate("sender", "-password");

    // Update chat's latestMessage
    chat.latestMessage = newMessage._id;
    chat.users.forEach((user) => {
      if (user._id.equals(userId) || chat.activeUsers.includes(user._id))
        return;

      let entry = chat.unread.find(
        (pair) => pair.user && pair.user.equals(user._id)
      );
      if (entry) {
        entry.count += 1;
      } else {
        chat.unread.push({ user: user._id, count: 1 });
      }
    });

    await chat.save();

    // Real time messaging functionality
    chat.users.forEach((user) => {
      const id = user._id;
      if (!id.equals(userId)) {
        const receiverSocketId = getSocketId(id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
      }
    });

    return res
      .status(201)
      .json({ success: true, message: "Message created", newMessage });
  } catch (error) {
    console.error("Error with sending messages", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
