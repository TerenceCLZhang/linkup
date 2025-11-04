import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { User } from "../types/User";
import toast from "react-hot-toast";
import { storeAPIErrors } from "../lib/storeAPIErrors";
import { io, Socket } from "socket.io-client";

interface AuthStore {
  authUser: User | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  isUpdatingAvatar: boolean;
  socket: Socket | null;
  onlineUsers: Set<string>;

  checkAuth: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerifcationEmail: () => Promise<void>;
  logOut: () => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isLoading: false,
  error: null,
  isCheckingAuth: true,
  isUpdatingAvatar: false,
  onlineUsers: new Set<string>(),
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");

      get().connectSocket();

      set({ authUser: res.data.user });
    } catch (error) {
      console.error("Error checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      set({ authUser: res.data.user });
    } catch (error: unknown) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (code: string) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/verify-email", {
        code,
      });

      set({ authUser: res.data.user });

      get().connectSocket();

      toast.success("Email successfully verified.");
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  resendVerifcationEmail: async () => {
    try {
      await axiosInstance.get("/auth/resend-verification-email");
      toast.success("Verifcation email resent.");
    } catch (error) {
      storeAPIErrors(error);
    }
  },

  logOut: async () => {
    set({ isLoading: true });

    try {
      await axiosInstance.post("/auth/logout");

      get().disconnectSocket();

      set({ authUser: null });
    } catch (error: unknown) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  logIn: async (email: string, password: string) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      set({ authUser: res.data.user });

      get().connectSocket();
    } catch (error: unknown) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true });

    try {
      await axiosInstance.post("/auth/forgot-password", {
        email,
      });
    } catch (error: unknown) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (password: string, token: string) => {
    set({ isLoading: true });

    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });
    } catch (error: unknown) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateAvatar: async (avatar: string) => {
    set({ isUpdatingAvatar: true });

    try {
      await axiosInstance.patch(`/auth/update-avatar`, {
        avatar,
      });
      toast.success("Avatar successfully updated.");
    } catch (error: unknown) {
      storeAPIErrors(error);
    } finally {
      set({ isUpdatingAvatar: false });
    }
  },

  updateName: async (name: string) => {
    set({ isLoading: true });

    try {
      await axiosInstance.patch(`/auth/update-name`, {
        name,
      });
      toast.success("Name successfully updated.");
    } catch (error: unknown) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  connectSocket: () => {
    const authUser = get().authUser;
    if (!authUser || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_BASE_BACKEND_URL, {
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: new Set(userIds) });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket?.disconnect();
    }
  },
}));
