import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import GroupChatHeaderBtns from "./Header/GroupChatHeaderBtns";
import UserAvatar from "./UserAvatar";

const ChatHeader = () => {
  const { selectedChat } = useChatStore();

  return selectedChat?.isGroupChat ? (
    <GroupChatHeader />
  ) : (
    <OneOnOneChatHeader />
  );
};

const OneOnOneChatHeader = () => {
  const { selectedChat } = useChatStore();
  const { authUser } = useAuthStore();

  const otherUser = selectedChat!.users.find((u) => u._id !== authUser!._id);

  return (
    <div className="flex items-center gap-2">
      <UserAvatar user={otherUser!} size="sm" includeStatus={false} />
    </div>
  );
};

const GroupChatHeader = () => {
  const { selectedChat } = useChatStore();

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="rounded-full shrink-0 self-start w-10 h-10 relative">
          <div className="overflow-hidden rounded-full ">
            <img
              src={selectedChat?.image || "/default_group.svg"}
              alt={`${selectedChat?.chatName}'s image`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <span className="font-semibold w-100 truncate">
          {selectedChat?.chatName}
        </span>
      </div>

      {selectedChat?.isGroupChat && <GroupChatHeaderBtns />}
    </div>
  );
};

export default ChatHeader;
