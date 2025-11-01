import { create } from "zustand";
import type { User } from "../types/User";
import { axiosInstance } from "../lib/axios";
import { storeAPIErrors } from "../lib/storeAPIErrors";
import type { Message } from "../types/Message";
import { useAuthStore } from "./useAuthStore";

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
  listenToMessages: () => void;
  unListenToMessages: () => void;
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
      set({ messages: [...get().messages, res.data.newMessage] });
    } catch (error) {
      storeAPIErrors(error);
    }
  },

  listenToMessages: () => {
    const selectedUser = get().selectedUser;
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket?.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return; // Only show message on the selected user chat

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unListenToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessages");
  },
}));
