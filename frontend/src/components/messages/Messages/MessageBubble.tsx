import { useAuthStore } from "../../../store/useAuthStore";
import type { Message } from "../../../types/Message";
import { LeftMessage, RightMessage } from "./Messages";

const MessageBubble = ({ message }: { message: Message }) => {
  const { authUser } = useAuthStore();

  const isSelf = message.sender._id === authUser?._id;

  return isSelf ? (
    <RightMessage message={message} user={message.sender} />
  ) : (
    <LeftMessage message={message} user={message.sender} />
  );
};

export default MessageBubble;
