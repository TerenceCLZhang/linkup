import { Navigate } from "react-router-dom";
import type { User } from "../types/User";

// For routes that require authentication
export const ProtectedRoute = ({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) => {
  return user ? <Navigate to={"/login"} replace /> : children;
};

// For routes that should only be accessed by unauthenticated users
export const PublicRoute = ({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) => {
  return user ? <Navigate to={"/"} replace /> : children;
};
