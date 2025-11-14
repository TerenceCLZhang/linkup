import SideBar from "../components/messages/SideBar/SideBar";
import MessagesContainer from "../components/messages/MessagesContainer";
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios";

const MessagesPage = () => {
  const {
    listenToUpdatedChat,
    unListenToUpdatedChat,
    listenToMessages,
    unListenToMessages,
    selectedChat,
  } = useChatStore();

  useEffect(() => {
    listenToUpdatedChat();
    listenToMessages();

    return () => {
      unListenToUpdatedChat();
      unListenToMessages();

      if (selectedChat) {
        axiosInstance.patch(`/chats/unview-chat/${selectedChat._id}`);
      }
    };
  }, [
    listenToMessages,
    listenToUpdatedChat,
    selectedChat,
    unListenToMessages,
    unListenToUpdatedChat,
  ]);

  return (
    <div className="bg-secondary container flex justify-between rounded-lg h-[75vh] max-h-5xl w-full overflow-hidden">
      <SideBar />
      <MessagesContainer />
    </div>
  );
};

export default MessagesPage;
