import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { handleJWT } from "../utils/handleJWT.js";
import { sendEmail } from "../utils/email.js";

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check for empty fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Check if user with given email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({
      success: false,
      message: "User with that email already exists.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    // Add user to DB
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    handleJWT(res, user._id);

    sendEmail({
      to: email,
      name,
      subject: "LinkUp - Verify your Email",
      text: `Your verification code is: ${verificationToken}.\n\n Enter this code on the verification page to complete your registration.\n\n This code will expire in 1 day.`,
    });

    const userObj = user?.toObject();

    return res.status(201).json({
      success: true,
      message: "User successfully created",
      user: { ...userObj, password: undefined },
    });
  } catch (error) {
    console.error("Error signing up", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { enteredToken } = req.body;

  // Check if token is present
  if (!enteredToken) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required." });
  }

  try {
    // Check whether token exists and is valid
    const user = await User.findOne({
      verificationToken: enteredToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect or exper" });
    }

    // Clear email verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    sendEmail({
      to: user.email,
      name: user.name,
      subject: "LinkUp - Welcome!",
      text: `Welcome to LinkUp!\n\nThis is a personal project made by Terence Zhang as a Slack/Discord clone, creating using the MERN (MongoDB, Express.js, React.js, Node.js) stack.`,
    });

    return res.json({ success: true, message: "Email successfully verified." });
  } catch (error) {
    console.error("Error validating email", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const logIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if email and password are present
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing email and/or password." });
  }

  try {
    // Check whether user with given email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    // Check if entered password is equal to stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password." });
    }

    handleJWT(res, user._id);

    user.lastLogin = new Date();

    await user.save();

    const userObj = user?.toObject();

    res.json({
      success: true,
      message: "User logged in.",
      user: { ...userObj, password: undefined },
    });
  } catch (error) {
    console.error("Error logging in", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const logOut = async (req: Request, res: Response) => {
  res.clearCookie("linkup-token");
  res.json({ success: true, message: "Logged out successfully." });
};

export const forgotPassword = async (req: Request, res: Response) => {
  
}