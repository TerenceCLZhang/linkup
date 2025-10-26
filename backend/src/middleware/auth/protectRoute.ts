import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../../models/User.js";
import { NextFunction, Request, Response } from "express";
import { ENV } from "../../config/env.js";
import { Types } from "mongoose";

interface UserJWTPayload extends JwtPayload {
  userId: Types.ObjectId;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["linkup-token"];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token provided." });
    }

    const decodedToken = jwt.verify(token, ENV.JWT_SECRET!) as UserJWTPayload;

    if (!decodedToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid token." });
    }

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    req.user = user.toObject();

    next();
  } catch (error) {
    console.error("Error verifying JWT", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
