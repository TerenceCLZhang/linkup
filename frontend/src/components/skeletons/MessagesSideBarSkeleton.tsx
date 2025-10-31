const MessagesSideBarSkeleton = () => {
  return (
    <div className="h-full overflow-y-auto space-y-4 pr-2">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="skeleton h-15 w-15" />
          <div className="flex flex-col gap-2">
            <div className="skeleton w-30 h-4" />
            <div className="skeleton w-15 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesSideBarSkeleton;
