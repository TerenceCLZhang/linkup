import { useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useClickOutside({ ref: modalRef, onClose: onClose });

  return (
    <div className="absolute top-0 left-0 h-screen w-screen z-20">
      <div className="bg-black/50 w-full h-full" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-secondary p-5 w-150 rounded-lg shadow-lg flex flex-col items-center gap-3"
        ref={modalRef}
      >
        <button type="button" onClick={onClose} className="self-end">
          <X />
        </button>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
