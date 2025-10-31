import { convertTimeAndDate } from "../../lib/convertDate";
import type { Message } from "../../types/Message";
import type { User } from "../../types/User";

export const LeftMessage = ({
  index,
  message,
  user,
}: {
  index: number;
  message: Message;
  user: User;
}) => {
  return (
    <div key={index} className="flex items-center gap-3 justify-start">
      <div className="rounded-full overflow-hidden shrink-0 self-start w-10 h-10">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-neutral-50 w-fit p-3 rounded-xl max-w-[50%]">
        <div className="flex gap-2 items-center">
          <span className="font-bold">{user.name}</span>
          <span className="text-xs">
            {convertTimeAndDate(message.createdAt)}
          </span>
        </div>

        <p>{message.text}</p>
      </div>
    </div>
  );
};

export const RightMessage = ({
  index,
  message,
  user,
}: {
  index: number;
  message: Message;
  user: User;
}) => {
  return (
    <div key={index} className="flex items-center gap-3 justify-end">
      <div className="bg-neutral-50 w-fit p-3 rounded-xl space-y-1 max-w-[50%]">
        <div className="flex gap-2 items-center justify-self-end">
          <span className="font-bold">{user.name}</span>
          <span className="text-xs">
            {convertTimeAndDate(message.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {message.image && (
            <div className="mx-auto rounded-lg overflow-hidden">
              <img
                src={message.image}
                alt="Message image"
                className="size-60"
              />
            </div>
          )}

          <p>{message.text}</p>
        </div>
      </div>

      <div className="rounded-full overflow-hidden shrink-0 self-start w-10 h-10">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
