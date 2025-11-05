const ChatContainerSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col gap-5 p-5">
      <div className="skeleton h-10 w-100 rounded-lg" />
      <div className="flex-1" />
      <div className="skeleton w-full h-10" />
    </div>
  );
};

export default ChatContainerSkeleton;
