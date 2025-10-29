import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const FormSubmitBtn = ({
  loadingText,
  notLoadingText,
  disabled = false,
}: {
  loadingText: string;
  notLoadingText: string;
  disabled?: boolean;
}) => {
  const { isLoading } = useAuthStore();

  return (
    <button
      type="submit"
      className="button-primary w-full mt-2"
      disabled={disabled}
    >
      {isLoading ? (
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
