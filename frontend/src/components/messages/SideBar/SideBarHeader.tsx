import { Plus, Users } from "lucide-react";
import { useRef, useState } from "react";
import ContactModal from "../Modals/ContactModal";
import GroupModal from "../Modals/GroupModal";
import DropDownList from "../../ui/DropDownList";

const SideBarHeader = () => {
  const [showList, setShowList] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="border-b-2 border-neutral-200 pb-3 flex justify-between">
      <h2 className="text-xl inline-flex items-center gap-3">
        <Users />
        My Chats
      </h2>

      <div className="relative">
        <button
          type="button"
          className="p-1"
          onClick={() => setShowList(!showList)}
          ref={buttonRef}
          aria-haspopup="menu"
          aria-expanded={showList}
          aria-controls="menu"
          aria-label="Show menu to add new contacts or create new group chat"
        >
          <Plus />
        </button>

        {showList && (
          <DropDownList
            onClose={() => setShowList(false)}
            buttonRef={buttonRef}
            showList={showList}
            width={59}
          >
            <button
              type="button"
              className="p-1 w-full"
              onClick={() => {
                setShowContactModal(true);
                setShowList(false);
              }}
            >
              Add Contact
            </button>
            <button
              type="button"
              className="p-1 w-full"
              onClick={() => {
                setShowGroupModal(true);
                setShowList(false);
              }}
            >
              Create Group Chat
            </button>
          </DropDownList>
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
