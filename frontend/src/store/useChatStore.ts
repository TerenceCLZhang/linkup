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
  addContact: (email: string) => Promise<void>;
  createGroupChat: (name: string, emails: string[]) => Promise<void>;
  listenToMessages: () => void;
  unListenToMessages: () => void;
  listenToNewChats: () => void;
  unListenToNewChats: () => void;
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

  addContact: async (email: string) => {
    try {
      const res = await axiosInstance.post(`/chats/create`, {
        email,
      });
      set({
        chats: [res.data.chat, ...get().chats],
        selectedChat: res.data.chat,
      });
    } catch (error) {
      storeAPIErrors(error);
    }
  },

  createGroupChat: async (name: string, emails: string[]) => {
    try {
      const res = await axiosInstance.post(`/chats/group-chat/create`, {
        name,
        emails,
      });
      set({
        chats: [res.data.chat, ...get().chats],
        selectedChat: res.data.chat,
      });
    } catch (error) {
      storeAPIErrors(error);
    }
  },

  listenToMessages: () => {
    const selectedChat = get().selectedChat;
    if (!selectedChat) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // New message listener
    socket.on("newMessage", (newMessage) => {
      const { selectedChat, messages } = get();
      if (
        !selectedChat ||
        newMessage.chat.toString() !== selectedChat._id.toString()
      )
        return;
      set({ messages: [...messages, newMessage] });
    });
  },

  unListenToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessages");
  },

  listenToNewChats: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Create chat listener
    socket.on("newChat", (chat) => {
      const { chats } = get();

      if (chats.find((c) => c._id === chat._id)) return; // Avoid duplicates

      set({ chats: [chat, ...chats] });
    });
  },

  unListenToNewChats: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newChat");
  },
}));
