import type { Message } from "./Message";
import type { User } from "./User";

interface IUnread {
  user: string;
  count: number;
}

export interface Chat {
  _id: string;
  isGroupChat: boolean;
  users: User[];
  chatName?: string | null | undefined;
  image?: string | null | undefined;
  latestMessage?: Message | null | undefined;
  groupAdmin?: User | null | undefined;
  unread: IUnread[];
  activeUsers: string[];
}
