import { Plus, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";

const SideBarHeader = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showAddDialog &&
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowAddDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAddDialog]);

  return (
    <div className="border-b-2 border-neutral-200 pb-3 flex justify-between">
      <h2 className="text-xl inline-flex items-center gap-3">
        <Users />
        My Chats
      </h2>

      <div className="relative">
        <button
          id="show-contact-modal-button"
          type="button"
          className="p-1"
          onClick={() => setShowAddDialog(!showAddDialog)}
          ref={buttonRef}
          aria-haspopup="menu"
          aria-expanded={showAddDialog}
          aria-controls="add-contact"
          aria-label="Show menu to add new contacts or create new group chat"
        >
          <Plus />
        </button>

        {showAddDialog && (
          <div
            className="absolute z-10 w-59 bg-secondary p-5 right-0 top-full mt-2 shadow-lg border border-neutral-200 flex gap-3 flex-col"
            ref={dialogRef}
            id="add-contact"
            role="menu"
            aria-labelledby="show-contact-modal-button"
          >
            <button
              type="button"
              className="p-1 w-full justify-start"
              onClick={() => {
                setShowContactModal(true);
                setShowAddDialog(false);
              }}
            >
              Add Contact
            </button>
            <button
              type="button"
              className="p-1 w-full justify-start"
              onClick={() => {
                setShowGroupModal(true);
                setShowAddDialog(false);
              }}
            >
              Create Group Chat
            </button>
          </div>
        )}
      </div>

      {showContactModal && (
        <ContactModal setShowContactModal={setShowContactModal} />
      )}
    </div>
  );
};

const ContactModal = ({
  setShowContactModal,
}: {
  setShowContactModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const { addContact } = useChatStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowContactModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowContactModal]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addContact(email);
      setShowContactModal(false);
    } catch (error) {
      console.error("Error adding new contact", error);
    }
  };

  return (
    <div className="absolute top-0 left-0 h-screen w-screen z-20">
      <div className="bg-black/50 w-full h-full" />
      <div
        className="absolute top-1/2 left-1/2 -translate-1/2 z-30 bg-secondary p-5 w-150 rounded-lg shadow-lg flex flex-col items-center gap-3"
        ref={modalRef}
      >
        <button
          type="button"
          onClick={() => setShowContactModal(false)}
          className="self-end p-0"
        >
          <X />
        </button>
        <div className="space-y-5 w-full">
          <h2 className="text-3xl">Add New Contact</h2>

          <form className="spacec-y-3" onSubmit={onSubmit}>
            <fieldset>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </fieldset>

            <button type="submit" className="button-primary w-full">
              Add Contact
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SideBarHeader;
