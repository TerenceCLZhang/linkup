import { Plus, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ContactModal from "./Modals/ContactModal";
import GroupModal from "./Modals/GroupModal";

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

      {showGroupModal && <GroupModal setShowGroupModal={setShowGroupModal} />}
    </div>
  );
};

export default SideBarHeader;
