import { useEffect } from "react";
import OneOnOneChat from "../Chats/OneOnOneChat";
import SideBarHeader from "./SideBarHeader";
import GroupChat from "../Chats/GroupChat";
import { useChatStore } from "../../../store/useChatStore";
import MessagesSideBarSkeleton from "../../skeletons/MessagesSideBarSkeleton";

const SideBar = () => {
  const {
    chats,
    isChatsLoading,
    getChats,
    listenToNewChats,
    unListenToNewChats,
    listenToRemoveChat,
    unListenToRemoveChat,
  } = useChatStore();

  useEffect(() => {
    getChats();
    listenToNewChats();
    listenToRemoveChat();

    return () => {
      unListenToNewChats();
      unListenToRemoveChat();
    };
  }, [
    getChats,
    listenToNewChats,
    listenToRemoveChat,
    unListenToNewChats,
    unListenToRemoveChat,
  ]);

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
          <div className="h-full overflow-y-auto scrollbar space-y-4 pr-2">
            {chats.map((chat, i) => {
              if (chat.isGroupChat) return <GroupChat key={i} chat={chat} />;
              return <OneOnOneChat key={i} chat={chat} />;
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
