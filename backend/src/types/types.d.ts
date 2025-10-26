import { IUser } from "../models/User.ts";

declare module "express-serve-static-core" {
  interface Request {
    user?: Omit<IUser, "password">; // Safe user type without password
  }
}
