import { Plus, Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import MessagesSideBarSkeleton from "../skeletons/MessagesSideBarSkeleton";
import OneOnOneChat from "./OneOnOneChat";

const SideBar = () => {
  const { chats, isChatsLoading, getChats } = useChatStore();

  useEffect(() => {
    getChats();
  }, [getChats]);

  return (
    <aside className="p-5 flex flex-col gap-5 bg-neutral-50 rounded-lg ">
      <SideBarHeader />

      <div className="w-75 flex-1 min-h-0">
        {isChatsLoading ? (
          <MessagesSideBarSkeleton />
        ) : (
          <div className="h-full overflow-y-auto space-y-4 pr-2">
            {chats.map((chat, i) => {
              if (chat.isGroupChat) return null; // TODO: add group chats
              return <OneOnOneChat key={i} chat={chat} />;
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

const SideBarHeader = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showAddModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowAddModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAddModal]);

  return (
    <div className="border-b-2 border-neutral-200 pb-3 flex justify-between">
      <h2 className="text-xl inline-flex items-center gap-3">
        <Users />
        Contacts
      </h2>

      <div className="relative">
        <button
          id="show-contact-modal-button"
          type="button"
          className="p-1"
          onClick={() => setShowAddModal(!showAddModal)}
          ref={buttonRef}
          aria-haspopup="menu"
          aria-expanded={showAddModal}
          aria-controls="add-contact"
          aria-label="Show menu to add new contacts or create new group chat"
        >
          <Plus />
        </button>

        {showAddModal && (
          <div
            className="absolute z-10 w-59 bg-secondary p-5 right-0 top-full mt-2 shadow-lg border border-neutral-200 flex gap-3 flex-col"
            ref={modalRef}
            id="add-contact"
            role="menu"
            aria-labelledby="show-contact-modal-button"
          >
            <button type="button" className="p-1 w-full justify-start">
              Add Contact
            </button>
            <button type="button" className="p-1 w-full justify-start">
              Create Group Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
