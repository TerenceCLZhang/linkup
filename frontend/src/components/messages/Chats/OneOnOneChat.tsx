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
      className="bg-transparent hover:bg-secondary p-1 w-full justify-start"
    >
      <UserAvatar user={otherUser!} size="md" />
    </button>
  );
};

export default OneOnOneChat;
