import express from "express";
import { protectRoute } from "../middleware/auth/protectRoute.js";
import {
  createChat,
  createGroupChat,
  deleteChat,
  getChatDetails,
  getUserChats,
  removeGroupChatUser,
  unViewChat,
  updateGroupChat,
  updateGroupChatImage,
  viewChat,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/", protectRoute, getUserChats);
router.get("/:chatId", protectRoute, getChatDetails);

router.post("/create", protectRoute, createChat);
router.post("/group-chat/create", protectRoute, createGroupChat);
router.post("/unview-chat/:chatId", protectRoute, unViewChat); // For page unload

router.patch("/group-chat/update/:chatId", protectRoute, updateGroupChat);
router.patch("/group-chat/image/:chatId", protectRoute, updateGroupChatImage);
router.patch("/group-chat/remove/:chatId", protectRoute, removeGroupChatUser);

router.delete("/:chatId", protectRoute, deleteChat);
router.patch("/view-chat/:chatId", protectRoute, viewChat);
router.patch("/unview-chat/:chatId", protectRoute, unViewChat);

export default router;
