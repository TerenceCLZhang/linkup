import { useMemo } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import type { Chat } from "../../types/Chat";

const OneOnOneChat = ({ chat }: { chat: Chat }) => {
  const { authUser, onlineUsers } = useAuthStore();
  const { setSelectedChat } = useChatStore();

  const otherUser = useMemo(
    () => chat?.users.find((u) => u._id !== authUser?._id),
    [chat?.users, authUser?._id]
  );

  return (
    <button
      type="button"
      onClick={() => setSelectedChat(chat)}
      className="flex items-center gap-2 bg-transparent w-full justify-start hover:bg-secondary p-1"
    >
      <div className="w-15 h-15 shrink-0 relative">
        <div className="overflow-hidden rounded-full ">
          <img
            src={otherUser!.avatar || "/default_avatar.svg"}
            alt={`${otherUser!.name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className={`absolute h-4 w-4 rounded-full right-0 bottom-0 border-2 border-neutral-50 ${
            onlineUsers.has(otherUser!._id) ? "bg-green-500" : "bg-neutral-500"
          }`}
        />
      </div>

      <div className="flex flex-col gap-1 text-left overflow-hidden">
        <span className="font-semibold truncate">{otherUser!.name}</span>
        <span className="text-sm">
          {onlineUsers.has(otherUser!._id) ? "Online" : "Offline"}
        </span>
      </div>
    </button>
  );
};

export default OneOnOneChat;
