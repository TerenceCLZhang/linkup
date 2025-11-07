import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useUsersStore } from "../store/useUsersStore";
import type { User } from "../types/User";

export const useSender = (senderId: string | null) => {
  const { authUser } = useAuthStore();
  const { getUserById } = useUsersStore();
  const [sender, setSender] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!senderId) return null;

      // If it's the current user, use that directly
      if (senderId === authUser?._id) {
        setSender(authUser);
        return;
      }

      // Otherwise look up (cached or fetch)
      const user = await getUserById(senderId);
      setSender(user);
    };

    load();
  }, [senderId, authUser?._id, authUser, getUserById]);

  return sender;
};
