import { Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useEffect } from "react";
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
      <div className="border-b-2 border-neutral-200 pb-3">
        <h2 className="text-xl inline-flex items-center gap-3">
          <Users />
          Contacts
        </h2>
      </div>

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

export default SideBar;
