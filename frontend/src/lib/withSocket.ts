import type { Socket } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

export const withSocket = (
  callback: (socket: Socket) => void,
  timeout = 10000
) => {
  const startTime = Date.now();
  const tryCall = () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      if (Date.now() - startTime < timeout) {
        setTimeout(tryCall, 500);
      } else {
        console.warn("Socket not available: stopped retrying after timeout.");
      }
      return;
    }
    callback(socket);
  };
  tryCall();
};
