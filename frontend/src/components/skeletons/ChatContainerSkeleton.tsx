const ChatContainerSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col gap-5 p-5">
      <div className="flex gap-1 items-center">
        <div className="skeleton size-10 rounded-full" />
        <div className="skeleton h-7 w-50" />
      </div>
      <div className="flex-1" />
      <div className="skeleton w-full h-10" />
    </div>
  );
};

export default ChatContainerSkeleton;
