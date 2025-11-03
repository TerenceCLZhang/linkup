import { useChatStore } from "../../store/useChatStore";
import { useEffect } from "react";
import MessagesSideBarSkeleton from "../skeletons/MessagesSideBarSkeleton";
import OneOnOneChat from "./OneOnOneChat";
import SideBarHeader from "./SideBarHeader";

const SideBar = () => {
  const {
    chats,
    isChatsLoading,
    getChats,
    listenToNewChats,
    unListenToNewChats,
  } = useChatStore();

  useEffect(() => {
    getChats();
    listenToNewChats();

    return () => unListenToNewChats();
  }, [getChats, listenToNewChats, unListenToNewChats]);

  return (
    <aside className="p-5 flex flex-col gap-5 bg-neutral-50 rounded-lg ">
      <SideBarHeader />

      <div className="w-75 flex-1 min-h-0">
        {isChatsLoading ? (
          <MessagesSideBarSkeleton />
        ) : chats.length === 0 ? (
          <div className="flex flex-col gap-3 items-center justify-center h-full">
            <h3 className="text-2xl">No Chats</h3>
            <span className="text-center">
              Press the + icon to add a new contact or create a group chat.
            </span>
          </div>
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

export default SideBar;
