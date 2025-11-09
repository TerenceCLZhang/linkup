import type { User } from "./User";

export interface Message {
  sender: User;
  chat: string;
  text: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
