import { useEffect, useState } from "react";
import type { Chat } from "../../../types/Chat";
import { useChatStore } from "../../../store/useChatStore";

const UnreadCount = ({ chat }: { chat: Chat }) => {
  const { unreadCounts } = useChatStore();

  const [count, setCount] = useState(unreadCounts[chat._id]);

  useEffect(() => {
    setCount(unreadCounts[chat._id]);
  }, [chat._id, unreadCounts]);

  if (count <= 0) return;

  return (
    <div className="bg-primary shadow-md text-secondary p-1 rounded-full w-10 h-10 text-sm flex items-center justify-center justify-self-end">
      {count > 50 ? "50+" : count}
    </div>
  );
};

export default UnreadCount;
