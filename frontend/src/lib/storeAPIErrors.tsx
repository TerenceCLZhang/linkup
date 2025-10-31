import axios from "axios";
import toast from "react-hot-toast";

export const storeAPIErrors = (error: unknown) => {
  let message = "Something went wrong.";

  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message || error.message || message;
  } else if (error instanceof Error) {
    message = error.message || message;
  }

  toast.error(message);
  throw error;
};
