import { Request, Response } from "express";
import Message from "../models/Message.js";
import cloudinary from "../config/cloudinary.js";
import { getSocketId, io } from "../config/socket.js";
import Chat from "../models/Chat.js";

export const getMessages = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if other chat ID is provided
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Chat ID not provided." });
  }

  try {
    const messages = await Message.find({ chat: id })
      .populate("sender", "-password")
      .sort({ createdAt: 1 });

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
    const userId = req.user?._id;

    const chat = await Chat.findById(chatId).populate("users", "_id");
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found." });
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
