import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { storeAPIErrors } from "../lib/storeAPIErrors";
import type { Message } from "../types/Message";
import { useAuthStore } from "./useAuthStore";
import type { Chat } from "../types/Chat";

interface ChatStore {
  chats: Chat[];
  messages: Message[];
  selectedChat: Chat | null;
  isChatsLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;

  toggleSound: () => void;
  setSelectedChat: (chat: Chat) => void;
  getChats: () => Promise<void>;
  getMessages: (otherUserId: string) => Promise<void>;
  sendMessage: (text?: string, image?: string) => Promise<void>;
  listenToMessages: () => void;
  unListenToMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: [],
  selectedChat: null,
  isChatsLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: Boolean(localStorage.getItem("isSoundEnabled")),

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", (!get().isSoundEnabled).toString());
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setSelectedChat: (selectedChat: Chat) => {
    set({ selectedChat });
  },

  getChats: async () => {
    set({ isChatsLoading: true });

    try {
      const res = await axiosInstance.get("/chats");
      set({ chats: res.data.chats });
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isChatsLoading: false });
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
        `/messages/send/${get().selectedChat?._id}`,
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
    const selectedChat = get().selectedChat;
    if (!selectedChat) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      // Only add messages that belong to the current chat
      if (newMessage.chat.toString() !== selectedChat._id.toString()) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unListenToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessages");
  },
}));
