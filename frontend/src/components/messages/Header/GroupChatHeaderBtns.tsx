import { Settings, Users } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useState } from "react";
import GroupMembersModal from "../Modals/GroupMembersModal";
import GroupSettingsModal from "../Modals/GroupSettingsModal";

const GroupChatHeaderBtns = () => {
  const { selectedChat } = useChatStore();
  const { authUser } = useAuthStore();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);

  return (
    <div className="flex gap-2 md:gap-5">
      <button
        type="button"
        onClick={() => setShowUserModal(true)}
        title="Group members"
      >
        <Users />
      </button>

      {selectedChat?.groupAdmin?._id === authUser?._id && (
        <button
          type="button"
          onClick={() => setShowGroupSettingsModal(true)}
          title="Group settings"
        >
          <Settings />
        </button>
      )}

      {showUserModal && (
        <GroupMembersModal setShowUserModal={setShowUserModal} />
      )}
      {showGroupSettingsModal && (
        <GroupSettingsModal
          setShowGroupSettingsModal={setShowGroupSettingsModal}
        />
      )}
    </div>
  );
};

export default GroupChatHeaderBtns;
