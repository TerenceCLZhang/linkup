import { useEffect } from "react";

export const useClickOutside = ({
  ref,
  onClose,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, ref]);
};
