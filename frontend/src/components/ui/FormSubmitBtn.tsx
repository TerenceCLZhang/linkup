import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const FormSubmitBtn = ({
  loadingText,
  notLoadingText,
  disabled = false,
}: {
  loadingText: string;
  notLoadingText: string;
  disabled?: boolean;
}) => {
  const { isLoading: authLoading } = useAuthStore();
  const { isLoading: chatLoading } = useChatStore();

  return (
    <button
      type="submit"
      className="button-primary w-full button-padding"
      disabled={disabled}
    >
      {authLoading || chatLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader className="animate-spin" />
          <span>{loadingText}...</span>
        </div>
      ) : (
        notLoadingText
      )}
    </button>
  );
};

export default FormSubmitBtn;
