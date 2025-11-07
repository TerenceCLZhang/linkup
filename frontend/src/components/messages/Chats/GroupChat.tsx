import { useSender } from "../../../hooks/useSender";
import { useChatStore } from "../../../store/useChatStore";
import type { Chat } from "../../../types/Chat";

const GroupChat = ({ chat }: { chat: Chat }) => {
  const { setSelectedChat } = useChatStore();

  const sender = useSender(chat.latestMessage?.senderId ?? null);

  return (
    <button
      type="button"
      onClick={() => setSelectedChat(chat)}
      className="flex items-center gap-2 bg-transparent w-full justify-start hover:bg-secondary p-1"
    >
      <div className="size-15 shrink-0 relative">
        <div className="overflow-hidden rounded-full bg-neutral-300">
          <img
            src={chat.image || "/default_group.svg"}
            alt={`${chat.chatName}'s image`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 text-left overflow-hidden">
        <span className="font-semibold truncate">{chat.chatName}</span>
        {chat.latestMessage && (
          <span className="text-xs italic truncate">
            {sender?.name}: {chat.latestMessage?.text}
          </span>
        )}
      </div>
    </button>
  );
};

export default GroupChat;
