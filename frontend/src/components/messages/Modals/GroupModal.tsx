import { useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Modal from "../../ui/Modal";
import { useChatStore } from "../../../store/useChatStore";
import FormSubmitBtn from "../../ui/FormSubmitBtn";

const GroupModal = ({
  setShowGroupModal,
}: {
  setShowGroupModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

  const { createGroupChat, isLoading } = useChatStore();

  const addEmail = () => {
    if (emails.length >= 5) {
      toast.error("Cannot add more than 5 users to a group chat.");
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
    if (!name.trim()) return toast.error("Group name required.");
    if (emails.length === 0) return toast.error("Add at least one user.");

    try {
      await createGroupChat(name, emails);
      setShowGroupModal(false);
    } catch (error) {
      console.error("Error creating group chat", error);
    }
  };

  return (
    <Modal onClose={() => setShowGroupModal(false)}>
      <h2 className="text-3xl mb-5">Create New Group Chat</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="name">Group Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            aria-disabled={isLoading}
          />
        </fieldset>

        <fieldset>
          <label htmlFor="emails">Add Emails</label>
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
              disabled={emails.length >= 5 || isLoading}
              aria-disabled={isLoading}
            />
            <button
              type="button"
              onClick={addEmail}
              className="button-primary button-padding"
              disabled={emails.length >= 5 || isLoading}
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

        <FormSubmitBtn
          loadingText="Creating Group Chat"
          notLoadingText="Create Group Chat"
          disabled={name === "" || emails.length === 0}
        />
      </form>
    </Modal>
  );
};

export default GroupModal;
