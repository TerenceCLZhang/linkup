import { Settings, Trash2, Users } from "lucide-react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { useState } from "react";
import GroupMembersModal from "../Modals/GroupMembersModal";
import GroupSettingsModal from "../Modals/GroupSettingsModal";
import ConfirmModal from "../../ui/ConfirmModal";

const GroupChatHeaderBtns = () => {
  const { selectedChat } = useChatStore();
  const { authUser } = useAuthStore();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

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
        <>
          <button
            type="button"
            onClick={() => setShowGroupSettingsModal(true)}
            title="Group settings"
          >
            <Settings />
          </button>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 transition-colors"
            onClick={() => setShowDeleteConfirmModal(true)}
            title="Delete group"
          >
            <Trash2 />
          </button>
        </>
      )}

      {showUserModal && (
        <GroupMembersModal setShowUserModal={setShowUserModal} />
      )}
      {showGroupSettingsModal && (
        <GroupSettingsModal
          setShowGroupSettingsModal={setShowGroupSettingsModal}
        />
      )}
      {showDeleteConfirmModal && (
        <ConfirmModal
          title="Delete Group"
          message="Are you sure you want to delete this entire group chat? This action is permanent and will remove all messages for everyone."
          confirmText="Delete"
          onConfirm={async () => {
            if (selectedChat) {
              await useChatStore.getState().deleteChat(selectedChat._id);
            }
          }}
          onClose={() => setShowDeleteConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default GroupChatHeaderBtns;
