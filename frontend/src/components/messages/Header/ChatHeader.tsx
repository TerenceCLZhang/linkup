import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";
import GroupChatHeaderBtns from "./GroupChatHeaderBtns";
import UserAvatar from "../UserAvatar";
import { ArrowLeft, X } from "lucide-react";

const ChatHeader = () => {
  const { selectedChat } = useChatStore();

  return selectedChat?.isGroupChat ? (
    <GroupChatHeader />
  ) : (
    <OneOnOneChatHeader />
  );
};

const OneOnOneChatHeader = () => {
  const { selectedChat, setSelectedChat } = useChatStore();
  const { authUser } = useAuthStore();

  const otherUser = selectedChat!.users.find((u) => u._id !== authUser!._id);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <button
          className="lg:hidden p-1 bg-transparent"
          onClick={() => setSelectedChat(null)}
          title="Back to chats"
        >
          <ArrowLeft className="size-6" />
        </button>
        <UserAvatar user={otherUser!} size="sm" />
        <span className="font-semibold">{otherUser?.name}</span>
      </div>

      <CloseChatBtn />
    </div>
  );
};

const GroupChatHeader = () => {
  const { selectedChat, setSelectedChat } = useChatStore();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          className="md:hidden p-1 bg-transparent"
          onClick={() => setSelectedChat(null)}
          title="Back to chats"
        >
          <ArrowLeft className="size-6 text-black" />
        </button>
        <div className="rounded-full shrink-0 self-start w-10 h-10 relative">
          <div className="overflow-hidden rounded-full ">
            <img
              src={selectedChat?.image || "/default_group.svg"}
              alt={`${selectedChat?.chatName}'s image`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <span className="font-semibold truncate">{selectedChat?.chatName}</span>
      </div>

      <div className="flex gap-2 sm:gap-5">
        {selectedChat?.isGroupChat && <GroupChatHeaderBtns />}
        <CloseChatBtn />
      </div>
    </div>
  );
};

const CloseChatBtn = () => {
  const { setSelectedChat } = useChatStore();

  return (
    <button title="Close chat" onClick={() => setSelectedChat(null)}>
      <X />
    </button>
  );
};

export default ChatHeader;
