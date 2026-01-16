import { useRef } from "react";
import { X } from "lucide-react";
import { useClickOutsideModal } from "../../hooks/useClickOutside";

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useClickOutsideModal({ ref: modalRef, onClose: onClose });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="relative bg-secondary p-5 w-full max-w-lg md:w-150 rounded-lg shadow-lg flex flex-col items-center gap-3 max-h-[90vh] overflow-y-auto"
        ref={modalRef}
      >
        <button
          type="button"
          onClick={onClose}
          className="self-end sticky top-0 bg-secondary p-1 rounded-full hover:bg-neutral-200 transition-colors"
        >
          <X className="size-6" />
        </button>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
