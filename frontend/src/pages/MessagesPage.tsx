import SideBar from "../components/messages/SideBar";
import MessagesContainer from "../components/messages/MessagesContainer";
import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const MessagesPage = () => {
  const {
    listenToUpdatedChat,
    unListenToUpdatedChat,
    listenToMessages,
    unListenToMessages,
  } = useChatStore();

  useEffect(() => {
    listenToUpdatedChat();
    listenToMessages();

    return () => {
      unListenToUpdatedChat();
      unListenToMessages();
    };
  }, [
    listenToMessages,
    listenToUpdatedChat,
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
