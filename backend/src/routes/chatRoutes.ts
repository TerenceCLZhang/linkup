import express from "express";
import { protectRoute } from "../middleware/auth/protectRoute.js";
import {
  createChat,
  createGroupChat,
  getChatDetails,
  getUserChats,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/", protectRoute, getUserChats);
router.get("/:chatId", protectRoute, getChatDetails);

router.post("/create", protectRoute, createChat);
router.post("/group-chat/create", protectRoute, createGroupChat);

// router.patch("/group-chat/name", protectRoute, updateGroupChatName);
// router.patch("/group-chat/image", protectRoute, updateGroupChatImage);
// router.patch("/group-chat/add", protectRoute, addGroupChatUser);
// router.patch("/group-chat/remove", removeGroupChatUser);

// router.delete("/group-chat/delete", protectRoute, deleteGroupChat)

export default router;
