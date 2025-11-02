import { Request, Response } from "express";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const getUserChats = async (req: Request, res: Response) => {
  const userId = req.user!._id;

  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
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

export const createChat = async (req: Request, res: Response) => {
  const { email } = req.body;
  const userId = req.user!._id;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Other user's email not provided." });
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
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );

    return res.status(201).json({ success: true, chat: fullChat });
  } catch (error) {
    console.error("Error creating one-on-one chat", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
