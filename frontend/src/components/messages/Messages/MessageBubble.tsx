import { useSender } from "../../../hooks/useSender";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Message } from "../../../types/Message";
import { LeftMessage, RightMessage } from "../Messages";

const MessageBubble = ({ message }: { message: Message }) => {
  const { authUser } = useAuthStore();
  const sender = useSender(message.senderId); // Determine the sender user

  if (!sender) return null; // still loading sender

  return message.senderId === authUser?._id ? (
    <RightMessage message={message} user={sender} />
  ) : (
    <LeftMessage message={message} user={sender} />
  );
};

export default MessageBubble;
