import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

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
  const { authUser, onlineUsers } = useAuthStore();

  const otherUser = selectedChat!.users.find((u) => u._id !== authUser!._id);

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full shrink-0 self-start w-10 h-10 relative">
        <div className="overflow-hidden rounded-full ">
          <img
            src={otherUser!.avatar || "/default_avatar.svg"}
            alt={`${otherUser!.name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className={`absolute h-3 w-3 rounded-full right-0 bottom-0 border-2 border-neutral-50 ${
            onlineUsers.has(otherUser!._id) ? "bg-green-500" : "bg-neutral-500"
          }`}
        />
      </div>
      <span className="font-semibold">{otherUser?.name}</span>
    </div>
  );
};

const GroupChatHeader = () => {
  const { selectedChat } = useChatStore();
  const { authUser } = useAuthStore();

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

      {selectedChat?.groupAdmin?._id === authUser?._id && <div>ADMIN</div>}
    </div>
  );
};

export default ChatHeader;
