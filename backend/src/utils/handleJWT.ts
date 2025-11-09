import { Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { Types } from "mongoose";

export const handleJWT = (res: Response, userId: Types.ObjectId) => {
  // Generate JWT
  const token = jwt.sign({ userId }, ENV.JWT_SECRET!, {
    expiresIn: "7d",
  });

  // Create cookie
  res.cookie("linkup-token", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
