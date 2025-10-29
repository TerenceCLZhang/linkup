import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import type { User } from "../types/User";
import axios from "axios";

interface AuthStore {
  authUser: User | null;
  isLoading: boolean;
  error: string | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  logOut: () => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isLoading: false,
  error: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data.user });
    } catch (error) {
      console.error("Error checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      set({ authUser: res.data.user });
    } catch (error: unknown) {
      let message = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (code: string) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.post("/auth/verify-email", {
        code,
      });

      set({ authUser: res.data.user });
    } catch (error) {
      let message = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logOut: async () => {
    set({ isLoading: true, error: null });

    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error: unknown) {
      let message = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      set({ authUser: res.data.user });
    } catch (error: unknown) {
      let message = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });

    try {
      await axiosInstance.post("/auth/forgot-password", {
        email,
      });
    } catch (error: unknown) {
      let message = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (password: string, token: string) => {
    set({ isLoading: true, error: null });

    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });
    } catch (error: unknown) {
      let message = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
