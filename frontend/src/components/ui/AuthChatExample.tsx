const AuthChatExample = () => {
  return (
    <div className="flex-1 flex flex-col gap-5 h-full justify-center">
      <div className="flex gap-3">
        <div className="bg-neutral-200 h-15 w-15 rounded-full" />
        <div className="bg-neutral-200 rounded-lg h-15 w-75 p-5 flex items-center text-xl">
          Welcome to LinkUp 👋
        </div>
      </div>
      <div className="flex gap-3 self-end">
        <div className="bg-neutral-200 rounded-lg h-30 w-75 p-5 flex items-center text-xl">
          Connect with friends, classmates, and teammates instantly.
        </div>
        <div className="bg-neutral-200 h-15 w-15 rounded-full" />
      </div>
    </div>
  );
};

export default AuthChatExample;
