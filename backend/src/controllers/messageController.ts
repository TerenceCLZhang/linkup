import { Request, Response } from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../config/cloudinary.js";

export const getUsersSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } });

    return res.json({ success: true, message: "Users found.", filteredUsers });
  } catch (error) {
    console.error("Error with fetching users for sidebar", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { otherUserId } = req.params;

  // Check if other user's ID is provided
  if (!otherUserId) {
    return res
      .status(400)
      .json({ success: false, message: "Other user's ID not provided." });
  }

  try {
    const loggedInUserId = req.user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
    });

    return res.json({ success: true, message: "Messages found.", messages });
  } catch (error) {
    console.error("Error with fetching messages", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { otherUserId } = req.params;
  const { text, image } = req.body;

  // Check if other user's ID is provided
  if (!otherUserId) {
    return res
      .status(400)
      .json({ success: false, message: "Other user's ID not provided." });
  }

  try {
    const loggedInUserId = req.user?._id;

    let imageUrl;

    // Upload image to cloudinary if present
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "linkup/message-images",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: loggedInUserId,
      receiverId: otherUserId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();

    //TODO: REAL-TIME FUNCTIONALITY

    return res.json({ success: true, message: "Message created", newMessage });
  } catch (error) {
    console.error("Error with sending messages", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
