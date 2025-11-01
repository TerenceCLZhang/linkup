import { Plus, Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import MessagesSideBarSkeleton from "../skeletons/MessagesSideBarSkeleton";
import { useAuthStore } from "../../store/useAuthStore";

const SideBar = () => {
  const { contacts, getContacts, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  return (
    <aside className="p-5 flex flex-col gap-5 bg-neutral-50 rounded-lg ">
      <SideBarHeader />

      <div className="w-75 flex-1 min-h-0">
        {isUsersLoading ? (
          <MessagesSideBarSkeleton />
        ) : (
          <div className="h-full overflow-y-auto space-y-4 pr-2">
            {contacts.map((contact, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setSelectedUser(contact)}
                className="flex items-center gap-2 bg-transparent w-full justify-start hover:bg-secondary p-1"
              >
                <div className="w-15 h-15 shrink-0 relative">
                  <div className="overflow-hidden rounded-full ">
                    <img
                      src={contact.avatar || "/default_avatar.svg"}
                      alt={`${contact.name}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div
                    className={`absolute h-4 w-4 rounded-full right-0 bottom-0 border-2 border-neutral-50 ${
                      onlineUsers.has(contact._id)
                        ? "bg-green-500"
                        : "bg-neutral-500"
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1 text-left overflow-hidden">
                  <span className="font-semibold truncate">{contact.name}</span>
                  <span className="text-sm">
                    {onlineUsers.has(contact._id) ? "Online" : "Offline"}
                  </span>
                </div>
              </button>
            ))}
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
