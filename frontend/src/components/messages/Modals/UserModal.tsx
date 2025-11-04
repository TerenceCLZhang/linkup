import { Check, X } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import Modal from "../../ui/Modal";
import UserAvatar from "../UserAvatar";
import { useAuthStore } from "../../../store/useAuthStore";
import { useState } from "react";
import type { User } from "../../../types/User";

const UserModal = ({
  setShowUserModal,
}: {
  setShowUserModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { selectedChat } = useChatStore();
  const { authUser } = useAuthStore();

  const [toRemoveUser, setToRemoveUser] = useState<User | null>(null);

  return (
    <Modal onClose={() => setShowUserModal(false)}>
      <h2 className="text-3xl mb-5">Members</h2>

      {!toRemoveUser ? (
        <div className="flex flex-col gap-3">
          {selectedChat?.users.map((user, i) => (
            <div key={i} className="flex justify-between items-center">
              <UserAvatar user={user!} size="md" />

              {selectedChat.groupAdmin?._id === user._id ? (
                <span className="font-bold">Group Owner</span>
              ) : (
                selectedChat.groupAdmin?._id === authUser?._id ||
                (authUser?._id === user._id && (
                  <button
                    type="button"
                    className="text-red-500 p-1"
                    title="Remove user"
                    onClick={() => setToRemoveUser(user)}
                  >
                    <X />
                  </button>
                ))
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-5 items-center">
          <UserAvatar user={toRemoveUser} size="md" includeStatus={false} />
          <span>
            {selectedChat?.groupAdmin?._id === authUser?._id
              ? "Are you sure you want to remove this user?"
              : "Are you sure you want to leave this group chat?"}
          </span>
          <div className="flex gap-5">
            <button
              type="button"
              className="p-0 text-red-500"
              onClick={() => setToRemoveUser(null)}
            >
              <X />
            </button>
            <button type="button" className="p-0 text-accent">
              <Check />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserModal;
