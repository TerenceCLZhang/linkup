import { useSender } from "../../../hooks/useSender";
import { useAuthStore } from "../../../store/useAuthStore";
import type { Message } from "../../../types/Message";
import {
  LeftMessageSkeleton,
  RightMessageSkeleton,
} from "../../skeletons/MessageSkeletons";
import { LeftMessage, RightMessage } from "./Messages";

const MessageBubble = ({ message }: { message: Message }) => {
  const { authUser } = useAuthStore();
  const sender = useSender(message.senderId); // Determine the sender user

  const isSelf = message.senderId === authUser?._id;

  // If the sender is still loading, show skeletons
  if (!sender) {
    return isSelf ? <RightMessageSkeleton /> : <LeftMessageSkeleton />;
  }

  return isSelf ? (
    <RightMessage message={message} user={sender} />
  ) : (
    <LeftMessage message={message} user={sender} />
  );
};

export default MessageBubble;
