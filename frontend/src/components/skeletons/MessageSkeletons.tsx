export const LeftMessageSkeleton = () => {
  return (
    <div className="flex items-center gap-3 justify-start">
      <div className="skeleton size-10 self-start rounded-full" />
      <div className="skeleton w-100 h-20" />
    </div>
  );
};

export const RightMessageSkeleton = () => {
  return (
    <div className="flex items-center gap-3 justify-end">
      <div className="skeleton w-100 h-20" />
      <div className="skeleton size-10 self-start rounded-full" />
    </div>
  );
};
