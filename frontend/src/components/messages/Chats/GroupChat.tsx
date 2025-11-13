import { useChatStore } from "../../../store/useChatStore";
import type { Chat } from "../../../types/Chat";

const GroupChat = ({ chat }: { chat: Chat }) => {
  const { setSelectedChat } = useChatStore();

  return (
    <button
      type="button"
      onClick={() => setSelectedChat(chat)}
      className="sidebar-chat-btn"
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

      <div className="sidebar-chat-info">
        <span className="sidebar-chat-name">{chat.chatName}</span>
        {chat.latestMessage && (
          <span className="sidebar-chat-latest-msg">
            {chat.latestMessage.sender.name}: {chat.latestMessage?.text}
          </span>
        )}
      </div>
    </button>
  );
};

export default GroupChat;
