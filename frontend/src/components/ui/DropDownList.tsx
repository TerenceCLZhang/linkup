import { useRef } from "react";
import { useClickOutsideList } from "../../hooks/useClickOutside";

const DropDownList = ({
  children,
  onClose,
  buttonRef,
  showList,
  width,
}: {
  children: React.ReactNode;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  showList: boolean;
  width: number;
}) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  useClickOutsideList({
    showList: showList,
    ref: listRef,
    buttonRef: buttonRef,
    onClose: onClose,
  });

  return (
    <div
      className={`absolute z-10 w-${width} bg-secondary p-5 right-0 top-full mt-2 shadow-lg border border-neutral-200 flex gap-3 flex-col`}
      ref={listRef}
      role="menu"
      aria-labelledby="show-contact-modal-button"
    >
      {children}
    </div>
  );
};

export default DropDownList;
