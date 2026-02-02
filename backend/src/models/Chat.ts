import mongoose, { Document, Types } from "mongoose";
import { IMessage } from "./Message.js";

interface IUnread {
  user: Types.ObjectId;
  count: number;
}

export interface IChat extends Document {
  _id: Types.ObjectId;
  chatName: string;
  isGroupChat: boolean;
  image: string;
  users: Types.ObjectId[];
  latestMessage: Types.ObjectId | IMessage;
  groupAdmin: Types.ObjectId;
  unread: Types.DocumentArray<IUnread>;
  activeUsers: Types.ObjectId[];
  deletedBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    unread: [
      {
        user: { type: mongoose.Schema.Types.ObjectId },
        count: { type: Number, default: 0 },
      },
    ],
    activeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
