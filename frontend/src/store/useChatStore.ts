import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { storeAPIErrors } from "../lib/storeAPIErrors";
import type { Message } from "../types/Message";
import { useAuthStore } from "./useAuthStore";
import type { Chat } from "../types/Chat";
import { withSocket } from "../lib/withSocket";
import toast from "react-hot-toast";

interface ChatStore {
  chats: Chat[];
  messages: Message[];
  selectedChat: Chat | null;
  isChatsLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  isLoading: boolean;
  isUpdatingGroupChatImage: boolean;
  unreadCounts: Record<string, number>;

  toggleSound: () => void;
  initSound: () => void;
  setSelectedChat: (newSelectedChat: Chat | null) => void;
  getChats: () => Promise<void>;
  getMessages: (otherUserId: string) => Promise<void>;
  sendMessage: (text?: string, image?: string) => Promise<void>;
  addContact: (email: string) => Promise<void>;
  createGroupChat: (name: string, emails: string[]) => Promise<void>;
  updateGroupChat: (name: string, emails: string[]) => Promise<void>;
  removeGroupChatUser: (email: string) => Promise<void>;
  updateGroupChatImage: (image: string) => Promise<void>;

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
  isUpdatingGroupChatImage: false,
  unreadCounts: {},

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    set({ isSoundEnabled: newValue });
    localStorage.setItem("isSoundEnabled", newValue ? "true" : "false");
  },

  initSound: () => {
    const stored = localStorage.getItem("isSoundEnabled");
    const isSoundEnabled = stored === null ? true : stored === "true";
    set({ isSoundEnabled });
    localStorage.setItem("isSoundEnabled", isSoundEnabled ? "true" : "false");
  },

  setSelectedChat: async (newSelectedChat: Chat | null) => {
    const { selectedChat } = get();

    const prevChatId = selectedChat?._id;
    const newChatId = newSelectedChat?._id;

    try {
      if (prevChatId && prevChatId !== newChatId) {
        await axiosInstance.patch(`chats/unview-chat/${prevChatId}`);
      }

      if (newChatId) {
        await axiosInstance.patch(`/chats/view-chat/${newChatId}`);
      }
    } catch (err) {
      console.error("Error updating chat view state", err);
    }

    set({ selectedChat: newSelectedChat });
  },

  getChats: async () => {
    set({ isChatsLoading: true });

    try {
      const res = await axiosInstance.get("/chats");
      const chats = res.data.chats;

      const authUser = useAuthStore.getState().authUser;

      const unreadCounts: Record<string, number> = {};
      chats.forEach((chat: Chat) => {
        const entry = chat.unread.find((u) => u.user === authUser!._id);
        unreadCounts[chat._id] = entry?.count ?? 0;
      });

      set({ chats, unreadCounts });
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

      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [id]: 0,
        },
      }));

      set({ messages: res.data.messages });
    } catch (error) {
      storeAPIErrors(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (text?: string, image?: string) => {
    const { selectedChat, chats, isSoundEnabled, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedChat?._id}`,
        {
          text,
          image,
        }
      );

      if (isSoundEnabled) {
        const audio = new Audio("/sound/sent.wav");
        audio.play().catch((error) => {
          console.error("Error playing sound", error);
        });
      }

      const updatedChat = {
        ...selectedChat!,
        latestMessage: res.data.newMessage,
      };

      set({
        messages: [...messages, res.data.newMessage],
        chats: [
          updatedChat,
          ...chats.filter((chat) => chat._id !== updatedChat._id),
        ],
      });
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

      const chat: Chat = res.data.chat;

      set({
        chats: [chat, ...get().chats],
        selectedChat: chat,
        unreadCounts: {
          ...get().unreadCounts,
          [chat._id]: 0,
        },
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

      const chat: Chat = res.data.chat;

      set({
        chats: [chat, ...get().chats],
        selectedChat: chat,
        unreadCounts: {
          ...get().unreadCounts,
          [chat._id]: 0,
        },
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

  updateGroupChatImage: async (image: string) => {
    set({ isUpdatingGroupChatImage: true });

    try {
      const res = await axiosInstance.patch(
        `chats/group-chat/image/${get().selectedChat?._id}`,
        {
          image,
        }
      );

      set({ selectedChat: res.data.chat });

      toast.success("Image successfully updated.");
    } catch (error: unknown) {
      storeAPIErrors(error);
    } finally {
      set({ isUpdatingGroupChatImage: false });
    }
  },

  listenToMessages: () => {
    // TODO: Fix notifcation error - Uncaught (in promise) NotAllowedError: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD

    withSocket((socket) => {
      socket.off("newMessage");

      socket.on("newMessage", (newMessage: Message) => {
        const { selectedChat, messages, isSoundEnabled, chats } = get();

        set({
          chats: [
            ...chats
              .filter((chat: Chat) => chat._id === newMessage.chat)
              .map((chat) => ({ ...chat, latestMessage: newMessage })),
            ...chats.filter((chat) => chat._id !== newMessage.chat),
          ],
        });

        if (!selectedChat || newMessage.chat !== selectedChat._id) {
          if (isSoundEnabled) {
            const audio = new Audio("/sound/receive.wav");
            audio.play().catch((error) => {
              console.error("Error playing sound", error);
            });
          }

          set((state) => ({
            unreadCounts: {
              ...state.unreadCounts,
              [newMessage.chat]: (state.unreadCounts[newMessage.chat] || 0) + 1,
            },
          }));

          return;
        }

        set({
          messages: [...messages, newMessage],
        });
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
