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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 bg-secondary p-6 w-full max-w-lg rounded-xl shadow-2xl flex flex-col items-center gap-4"
        ref={modalRef}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <X className="size-5" />
        </button>
        <div className="w-full pt-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
