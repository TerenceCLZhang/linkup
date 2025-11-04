import express from "express";
import { protectRoute } from "../middleware/auth/protectRoute.js";
import {
  createChat,
  createGroupChat,
  getChatDetails,
  getUserChats,
  removeGroupChatUser,
  updateGroupChat,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/", protectRoute, getUserChats);
router.get("/:chatId", protectRoute, getChatDetails);

router.post("/create", protectRoute, createChat);
router.post("/group-chat/create", protectRoute, createGroupChat);

router.patch("/group-chat/update/:chatId", protectRoute, updateGroupChat);
// router.patch("/group-chat/image/:chatId", protectRoute, updateGroupChatImage);
router.patch("/group-chat/remove/:chatId", protectRoute, removeGroupChatUser);

export default router;
