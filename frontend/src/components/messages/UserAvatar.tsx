import { useAuthStore } from "../../store/useAuthStore";
import type { User } from "../../types/User";

const UserAvatar = ({
  user,
  size,
}: {
  user: User;
  size: "md" | "sm";
  includeStatus?: boolean;
}) => {
  const { onlineUsers } = useAuthStore();

  return (
    <div className="shrink-0 relative flex items-center gap-2">
      <div className={`${size === "md" ? "size-15" : "size-10"} relative`}>
        <div className="overflow-hidden rounded-full">
          <img
            src={user!.avatar || "/default_avatar.svg"}
            alt={`${user!.name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className={`absolute ${
            size === "md" ? "size-4" : "size-3"
          } rounded-full right-0 bottom-0 border-2 border-neutral-50 ${
            onlineUsers.has(user!._id) ? "bg-green-500" : "bg-neutral-500"
          }`}
        />
      </div>
    </div>
  );
};

export default UserAvatar;
