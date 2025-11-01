import { MessageSquare } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import { useAuthStore } from "../../store/useAuthStore";
import { LeftMessage, RightMessage } from "./Messages";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    listenToMessages,
    unListenToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom of the chat
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      listenToMessages();
    }

    return () => unListenToMessages();
  }, [selectedUser, getMessages, listenToMessages, unListenToMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 p-5 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!selectedUser) {
    return <NoChatSelectedContainer />;
  }

  return (
    <div className="flex-1 flex flex-col gap-5 p-5">
      <ChatHeader />
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto px-5 scrollbar">
        {messages.map((message, i) => {
          return message.senderId === authUser?._id ? (
            <RightMessage key={i} message={message} user={authUser} />
          ) : (
            <LeftMessage key={i} message={message} user={selectedUser} />
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

const ChatHeader = () => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full shrink-0 self-start w-10 h-10 relative">
        <div className="overflow-hidden rounded-full ">
          <img
            src={selectedUser!.avatar || "/default_avatar.svg"}
            alt={`${selectedUser!.name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className={`absolute h-3 w-3 rounded-full right-0 bottom-0 border-2 border-neutral-50 ${
            onlineUsers.has(selectedUser!._id)
              ? "bg-green-500"
              : "bg-neutral-500"
          }`}
        />
      </div>
      <span className="font-semibold">{selectedUser?.name}</span>
    </div>
  );
};

export default ChatContainer;
