import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { storeAPIErrors } from "../lib/storeAPIErrors";
import type { Message } from "../types/Message";
import { useAuthStore } from "./useAuthStore";
import type { Chat } from "../types/Chat";
import { withSocket } from "../lib/withSocket";

interface ChatStore {
  chats: Chat[];
  messages: Message[];
  selectedChat: Chat | null;
  isChatsLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  isLoading: boolean;

  toggleSound: () => void;
  setSelectedChat: (chat: Chat) => void;
  getChats: () => Promise<void>;
  getMessages: (otherUserId: string) => Promise<void>;
  sendMessage: (text?: string, image?: string) => Promise<void>;
  addContact: (email: string) => Promise<void>;
  createGroupChat: (name: string, emails: string[]) => Promise<void>;
  updateGroupChat: (name: string, emails: string[]) => Promise<void>;
  removeGroupChatUser: (email: string) => Promise<void>;

  listenToMessages: () => void;
  unListenToMessages: () => void;
  listenToNewChats: () => void;
  unListenToNewChats: () => void;
  listenToUpdatedChat: () => void;
  unListenToUpdatedChat: () => void;
  listenToRemoveChat: () => void;
  unListenToRemoveChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: [],
  selectedChat: null,
  isChatsLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: Boolean(localStorage.getItem("isSoundEnabled")),
  isLoading: false,

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
    const formattedEmail = email.trim().toLowerCase();
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post(`/chats/create`, {
        email: formattedEmail,
      });
      set({
        chats: [res.data.chat, ...get().chats],
        selectedChat: res.data.chat,
      });
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createGroupChat: async (name: string, emails: string[]) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/chats/group-chat/create", {
        name,
        emails,
      });
      set({
        chats: [res.data.chat, ...get().chats],
        selectedChat: res.data.chat,
      });
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateGroupChat: async (name: string, emails: string[]) => {
    set({ isLoading: true });

    try {
      const selectedChat = get().selectedChat;
      if (!selectedChat?._id) return;

      const res = await axiosInstance.patch(
        `/chats/group-chat/update/${selectedChat._id}`,
        {
          name,
          emails,
        }
      );

      const updatedChat = res.data.chat;

      // Update chat list and selected chat
      set({
        chats: get().chats.map((chat) =>
          chat._id === updatedChat._id
            ? {
                ...chat,
                chatName: updatedChat.chatName,
                users: updatedChat.users,
              }
            : chat
        ),
        selectedChat:
          selectedChat._id === updatedChat._id
            ? ({
                ...selectedChat,
                chatName: updatedChat.chatName,
                users: updatedChat.users,
              } as Chat)
            : selectedChat,
      });
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeGroupChatUser: async (email: string) => {
    const formattedEmail = email.trim().toLowerCase();
    set({ isLoading: true });

    try {
      const selectedChat = get().selectedChat;
      if (!selectedChat?._id) return;

      const res = await axiosInstance.patch(
        `/chats/group-chat/remove/${selectedChat._id}`,
        { email: formattedEmail }
      );

      const updatedChat = res.data.chat;
      const authUser = useAuthStore.getState().authUser;

      // Update chat list and selected chat
      set({
        chats: get().chats.map((chat) =>
          chat._id === updatedChat._id
            ? { ...chat, users: updatedChat.users }
            : chat
        ),
        selectedChat:
          selectedChat._id === updatedChat._id
            ? ({ ...selectedChat, users: updatedChat.users } as Chat)
            : selectedChat,
      });

      // If user removed themselves, update state accordingly
      if (formattedEmail === authUser?.email) {
        set({
          chats: get().chats.filter((chat) => chat._id !== selectedChat._id),
          selectedChat: null,
        });
      }
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isLoading: false });
    }
  },

  listenToMessages: () => {
    const selectedChat = get().selectedChat;
    if (!selectedChat) return;

    withSocket((socket) => {
      socket.off("newMessage");

      socket.on("newMessage", (newMessage) => {
        const { selectedChat, messages } = get();
        if (!selectedChat || newMessage.chat !== selectedChat._id) return;
        set({ messages: [...messages, newMessage] });
      });
    });
  },

  unListenToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessages");
  },

  listenToNewChats: () => {
    withSocket((socket) => {
      socket.off("newChat");

      socket.on("newChat", (chat) => {
        const { chats } = get();
        if (!chats.find((c) => c._id === chat._id)) {
          set({ chats: [chat, ...chats] });
        }
      });
    });
  },

  unListenToNewChats: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newChat");
  },

  listenToUpdatedChat: () => {
    withSocket((socket) => {
      socket.off("updatedChat");

      socket.on("updatedChat", (updatedChat: Chat) => {
        const { chats, selectedChat } = get();

        const chatExists = chats.some((chat) => chat._id === updatedChat._id);

        // Update existing chat list
        let newChats = chats.map((chat) =>
          chat._id === updatedChat._id ? { ...chat, ...updatedChat } : chat
        );

        // Add chat if it doesn't exist
        if (!chatExists) {
          newChats = [updatedChat, ...newChats];
        }

        set({ chats: newChats });

        // Update selected chat if it's the one being updated
        if (selectedChat?._id === updatedChat._id) {
          set({ selectedChat: { ...selectedChat, ...updatedChat } });
        }
      });
    });
  },

  unListenToUpdatedChat: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("updatedChat");
  },

  listenToRemoveChat: () => {
    withSocket((socket) => {
      socket.off("removeChat");

      socket.on("removeChat", (data: { chatId: string }) => {
        const { chatId } = data;
        const { chats } = get();

        console.log(chatId);

        set({
          chats: chats.filter((c) => c._id !== chatId),
          selectedChat: null,
        });
      });
    });
  },

  unListenToRemoveChat: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("removeChat");
  },
}));
