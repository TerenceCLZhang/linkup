import { create } from "zustand";
import type { User } from "../types/User";
import { axiosInstance } from "../lib/axios";
import { storeAPIErrors } from "../lib/storeAPIErrors";

interface UsersStore {
  userCache: Record<string, User>;
  getUserById: (id: string) => Promise<User>;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
  userCache: {},

  getUserById: async (id: string) => {
    const cache = get().userCache;
    if (cache[id]) return cache[id];

    try {
      const res = await axiosInstance.get(`/auth/user/${id}`);
      const user = res.data.user;
      set({ userCache: { ...cache, id: user } });
      return user;
    } catch (error) {
      storeAPIErrors(error);
      throw error;
    }
  },
}));
