import { MessageSquare } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatHeader from "./Header/ChatHeader";
import MessageBubble from "./Messages/MessageBubble";
import ChatContainerSkeleton from "../skeletons/ChatContainerSkeleton";
import DateSeparator from "./Messages/DateSeparator";

const MessagesContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedChat } =
    useChatStore();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat
  useEffect(() => {
    const scrollToBottom = () => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    };

    // Find all images inside chat container
    const chatContainer = bottomRef.current?.parentElement;
    if (!chatContainer) return;

    const images = chatContainer.querySelectorAll("img");
    let loadedCount = 0;

    if (images.length === 0) {
      scrollToBottom();
      return;
    }

    const onLoad = () => {
      loadedCount += 1;
      if (loadedCount === images.length) scrollToBottom();
    };

    images.forEach((img) => {
      if (img.complete) {
        loadedCount += 1;
      } else {
        img.addEventListener("load", onLoad, { once: true });
        img.addEventListener("error", onLoad, { once: true });
      }
    });

    // If all images were already loaded
    if (loadedCount === images.length) scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat._id);
    }
  }, [getMessages, selectedChat]);

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
        {messages.map((message, i) => {
          const prevMessage = messages[i - 1];
          const showDateSeparator =
            !prevMessage ||
            new Date(message.createdAt).toDateString() !==
              new Date(prevMessage.createdAt).toDateString();

          return (
            <div key={i}>
              {showDateSeparator && <DateSeparator date={message.createdAt} />}
              <MessageBubble message={message} />
            </div>
          );
        })}
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

export default MessagesContainer;
