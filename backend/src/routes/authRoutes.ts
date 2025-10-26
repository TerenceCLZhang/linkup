import express from "express";
import {
  checkAuth,
  forgotPassword,
  logIn,
  logOut,
  resetPassword,
  signUp,
  updateAvatar,
  verifyEmail,
} from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/auth/protectRoute.js";

const router = express.Router();

router.get("/check-auth", protectRoute, checkAuth); // Used for when the user refreshes page

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.put("/update-avatar", protectRoute, updateAvatar);

export default router;
