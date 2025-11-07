import { useState } from "react";
import Modal from "../../ui/Modal";
import { useChatStore } from "../../../store/useChatStore";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import ImageUploaderCircle from "../../ui/ImageUploaderCircle";

const GroupSettingsModal = ({
  setShowGroupSettingsModal,
}: {
  setShowGroupSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    selectedChat,
    updateGroupChat,
    updateGroupChatImage,
    isUpdatingGroupChatImage,
  } = useChatStore();

  // TODO: Implemnt Change Group Image

  const [name, setName] = useState(selectedChat!.chatName || "");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

  const addEmail = () => {
    if (emails.length + selectedChat!.users.length >= 6) {
      toast.error("A group chat cannot contain more than 5 members.");
      return;
    }

    const trimmed = emailInput.trim();
    if (trimmed && !emails.includes(trimmed)) {
      setEmails([...emails, trimmed]);
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat) return;

    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      toast.error("Name cannot be empty.");
    }

    if (selectedChat.users.length + emails.length > 6) {
      toast.error("Cannot have more than 6 users in a group chat.");
    }

    try {
      await updateGroupChat(name, emails);

      setEmails([]);
      toast.success("Group successfully updated.");
    } catch (error) {
      console.error("Error updating group chat", error);
    }
  };

  return (
    <Modal onClose={() => setShowGroupSettingsModal(false)}>
      <h2 className="text-3xl mb-5">Edit Group Chat</h2>

      <div className="border-b border-neutral-300 pb-5">
        <ImageUploaderCircle
          currentImage={selectedChat?.image}
          defaultImage="/default_group.svg"
          onUpload={updateGroupChatImage}
          isUploading={isUpdatingGroupChatImage}
        />
      </div>

      <form onSubmit={onSubmit} className="pt-5">
        <fieldset>
          <label htmlFor="name">Group Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="email">Add New Emails</label>
          <div className="flex gap-2">
            <input
              id="emails"
              type="email"
              value={emailInput}
              inputMode="email"
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addEmail();
                }
              }}
              disabled={emails.length + selectedChat!.users.length >= 5}
            />
            <button
              type="button"
              onClick={addEmail}
              className="button-primary button-padding"
              disabled={emails.length + selectedChat!.users.length >= 5}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {emails.map((email) => (
              <span
                key={email}
                className="bg-gray-200 px-2 py-1 rounded-lg flex items-center gap-1 max-w-100"
              >
                <span className="truncate">{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="text-red-500 font-bold bg-transparent"
                >
                  <X />
                </button>
              </span>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="button-primary w-full button-padding"
          disabled={name === selectedChat?.chatName && emails.length === 0}
        >
          Update Group
        </button>
      </form>
    </Modal>
  );
};

export default GroupSettingsModal;
