import { create } from "zustand";
import type { User } from "../types/User";
import { axiosInstance } from "../lib/axios";
import { storeAPIErrors } from "../lib/storeAPIErrors";
import type { Message } from "../types/Message";

interface ChatStore {
  contacts: User[];
  messages: Message[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setSelectedUser: (selectedUser: User) => void;
  getContacts: () => Promise<void>;
  getMessages: (otherUserId: string) => Promise<void>;
  sendMessage: (text?: string, image?: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  contacts: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: Boolean(localStorage.getItem("isSoundEnabled")),

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", (!get().isSoundEnabled).toString());
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setSelectedUser: (selectedUser: User) => {
    set({ selectedUser });
  },

  getContacts: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ contacts: res.data.users });
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (id: string) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${id}`);
      set({ messages: res.data.messages });
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (text?: string, image?: string) => {
    try {
      const res = await axiosInstance.post(
        `/messages/send/${get().selectedUser?._id}`,
        {
          text,
          image,
        }
      );
      set({ messages: [...get().messages, res.data.messages] });
    } catch (error) {
      storeAPIErrors(error);
    }
  },
}));
