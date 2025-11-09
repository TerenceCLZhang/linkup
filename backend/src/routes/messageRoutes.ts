import express from "express";
import { protectRoute } from "../middleware/auth/protectRoute.js";
import { getMessages, sendMessage } from "../controllers/messageControllers.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
