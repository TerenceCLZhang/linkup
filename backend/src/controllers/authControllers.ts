import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { handleJWT } from "../utils/handleJWT.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";
import { ENV } from "../config/env.js";
import cloudinary from "../config/cloudinary.js";

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
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day
    });

    await user.save();

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
      .json({ success: false, message: "Token not provided." });
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
        .json({ success: false, message: "Incorrect or expiered token." });
    }

    // Clear email verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    handleJWT(res, user._id);

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
      .json({ success: false, message: "Email and/or password not provided." });
  }

  try {
    // Check whether user with given email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Incorrect email and/or password.",
      });
    }

    // Check if entered password is equal to stored password
    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email and/or password." });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "User is not verified." });
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
  const { email } = req.body;

  // Check if email present
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email not provided." });
  }

  try {
    // Find user with specified email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Generate reset token
    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    sendEmail({
      to: user.email,
      name: user.name,
      subject: "LinkUp - Reset Password",
      text: `Click on the link to reset your password: ${ENV.CLIENT_URL}/reset-password/${user.resetPasswordToken}`,
    });

    return res.json({ success: true, message: "Password reset email sent." });
  } catch (error) {
    console.error("Error in forgot password", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  // Check if token and password are present
  if (!token) {
    return res
      .status(404)
      .json({ success: false, message: "Token not provided." });
  }

  if (!password) {
    return res
      .status(404)
      .json({ success: false, message: "New password not provided." });
  }

  try {
    // Check if the token is valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expiered token." });
    }

    // Set new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();

    sendEmail({
      to: user.email,
      name: user.name,
      subject: "LinkUp - Password Reset Successful!",
      text: `Your password has been successfully reset.\n\nIf you did not make this change, please contact support immediately.`,
    });

    return res.json({ success: true, message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user!._id;

  // Check if avatar is provided
  if (!avatar) {
    return res
      .status(400)
      .json({ success: false, message: "Avatar not provided." });
  }

  try {
    // Upload to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(avatar, {
      folder: "linkup/avatars",
    });

    // Update DB with cloudinary url
    const user = await User.findByIdAndUpdate(
      userId,
      {
        avatar: uploadResponse.secure_url,
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "User avatar successfully updated.",
      user,
    });
  } catch (error) {
    console.error("Error with updating avatar");
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  try {
    return res.json({ success: true, user: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
