import { MessageSquare } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect } from "react";
import ChatInput from "./ChatInput";
import { useAuthStore } from "../../store/useAuthStore";
import { LeftMessage, RightMessage } from "./Messages";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

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
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {messages.map((message, i) => {
          return message.senderId === authUser?._id ? (
            <RightMessage index={i} message={message} user={authUser} />
          ) : (
            <LeftMessage index={i} message={message} user={selectedUser} />
          );
        })}
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

  return (
    <div className="flex items-center gap-4">
      <div className="rounded-full overflow-hidden shrink-0 self-start w-10 h-10">
        <img
          src={selectedUser?.avatar}
          alt={`${selectedUser?.name}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="font-semibold">{selectedUser?.name}</span>
    </div>
  );
};

export default ChatContainer;
