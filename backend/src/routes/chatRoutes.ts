import express from "express";
import { protectRoute } from "../middleware/auth/protectRoute.js";
import {
  createChat,
  getChatDetails,
  getUserChats,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/", protectRoute, getUserChats);
router.get("/:chatId", protectRoute, getChatDetails);
router.post("/create", protectRoute, createChat);

export default router;
