import { Settings, Users } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useState } from "react";
import UserModal from "../Modals/UserModal";
import GroupSettingsModal from "../Modals/GroupSettingsModal";

const GroupChatHeaderBtns = () => {
  const { selectedChat } = useChatStore();
  const { authUser } = useAuthStore();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);

  return (
    <div className="flex gap-5">
      <button
        type="button"
        className="p-0"
        onClick={() => setShowUserModal(true)}
      >
        <Users />
      </button>

      {selectedChat?.groupAdmin?._id === authUser?._id && (
        <button
          type="button"
          className="p-0"
          onClick={() => setShowGroupSettingsModal(true)}
        >
          <Settings />
        </button>
      )}

      {showUserModal && <UserModal setShowUserModal={setShowUserModal} />}
      {showGroupSettingsModal && (
        <GroupSettingsModal
          setShowGroupSettingsModal={setShowGroupSettingsModal}
        />
      )}
    </div>
  );
};

export default GroupChatHeaderBtns;
