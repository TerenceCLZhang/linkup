import type { User } from "../../../types/User";
import { convertOnlyTime } from "../../../lib/convertDate";
import type { Message } from "../../../types/Message";
import Linkify from "linkify-react";
import MessageImage from "./MessageImage";

const linkifyOptions = {
  target: "_blank",
  rel: "noopener noreferrer",
};

export const LeftMessage = ({
  message,
  user,
}: {
  message: Message;
  user: User;
}) => {
  return (
    <div className="flex items-center gap-2 md:gap-3 justify-start">
      <div className="rounded-full overflow-hidden shrink-0 self-start w-8 h-8 md:w-10 md:h-10">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-neutral-50 w-fit p-2 md:p-3 rounded-xl max-w-[80%] md:max-w-[50%]">
        <div className="flex gap-2 items-center">
          <span className="font-bold truncate flex-1 text-sm md:text-base">
            {user.name}
          </span>
          <span className="text-[10px] md:text-xs">
            {convertOnlyTime(message.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {message.image && <MessageImage image={message.image} />}

          <Linkify
            as={"p"}
            options={linkifyOptions}
            className="whitespace-pre-wrap text-sm md:text-base"
          >
            {message.text}
          </Linkify>
        </div>
      </div>
    </div>
  );
};

export const RightMessage = ({
  message,
  user,
}: {
  message: Message;
  user: User;
}) => {
  return (
    <div className="flex items-center gap-2 md:gap-3 justify-end">
      <div className="bg-neutral-50 w-fit p-2 md:p-3 rounded-xl space-y-1 max-w-[80%] md:max-w-[50%]">
        <div className="flex gap-2 items-center justify-self-end">
          <span className="font-bold truncate flex-1 text-sm md:text-base">
            {user.name}
          </span>
          <span className="text-[10px] md:text-xs">
            {convertOnlyTime(message.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {message.image && <MessageImage image={message.image} />}

          <Linkify
            as={"p"}
            options={linkifyOptions}
            className="whitespace-pre-wrap text-sm md:text-base"
          >
            {message.text}
          </Linkify>
        </div>
      </div>

      <div className="rounded-full overflow-hidden shrink-0 self-start w-8 h-8 md:w-10 md:h-10">
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
