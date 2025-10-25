import express from "express";
import { forgotPassword, logIn, logOut, signUp, verifyEmail } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)

export default router;
