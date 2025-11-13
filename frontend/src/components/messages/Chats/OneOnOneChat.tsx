import { useMemo } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";
import type { Chat } from "../../../types/Chat";
import UserAvatar from "../UserAvatar";

const OneOnOneChat = ({ chat }: { chat: Chat }) => {
  const { authUser } = useAuthStore();
  const { setSelectedChat } = useChatStore();

  const otherUser = useMemo(
    () => chat?.users.find((u) => u._id !== authUser?._id),
    [chat?.users, authUser?._id]
  );

  return (
    <button
      type="button"
      onClick={() => setSelectedChat(chat)}
      className="sidebar-chat-btn"
    >
      <UserAvatar user={otherUser!} size="md" />
      <div className="sidebar-chat-info">
        <span className="sidebar-chat-name">{otherUser?.name}</span>
        {chat.latestMessage && (
          <span className="sidebar-chat-latest-msg">
            {chat.latestMessage.sender.name}: {chat.latestMessage?.text}
          </span>
        )}
      </div>
    </button>
  );
};

export default OneOnOneChat;
