import { MessageSquare } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./Messages/MessageBubble";
import ChatContainerSkeleton from "../skeletons/ChatContainerSkeleton";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedChat,
    listenToMessages,
    unListenToMessages,
  } = useChatStore();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat
  useEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100); // 100ms delay

    return () => clearTimeout(timeout);
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat._id);
      listenToMessages();
    }

    return () => unListenToMessages();
  }, [getMessages, listenToMessages, unListenToMessages, selectedChat]);

  if (isMessagesLoading) {
    return <ChatContainerSkeleton />;
  }

  if (!selectedChat) {
    return <NoChatSelectedContainer />;
  }

  return (
    <div className="flex-1 flex flex-col gap-5 p-5">
      <ChatHeader />
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto px-5 scrollbar">
        {messages.map((message, i) => (
          <MessageBubble key={i} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      <ChatInput />
    </div>
  );
};

const NoChatSelectedContainer = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5 flex-1">
      <div className="text-accent bg-white w-fit p-5 rounded-2xl">
        <MessageSquare className="size-10 fill-primary" />
      </div>
      <div className="text-center space-y-3">
        <h4 className="text-2xl">Welcome to LinkUp!</h4>
        <p>Select a chat from the sidebar to start connecting with others.</p>
      </div>
    </div>
  );
};

export default ChatContainer;
