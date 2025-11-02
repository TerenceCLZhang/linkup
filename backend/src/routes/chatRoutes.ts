import express from "express";
import { protectRoute } from "../middleware/auth/protectRoute.js";
import { createChat, getUserChats } from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/", protectRoute, getUserChats);
router.post("/create", protectRoute, createChat);

export default router;
