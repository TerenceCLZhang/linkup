import { useEffect } from "react";

export const useClickOutsideModal = ({
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

export const useClickOutsideList = ({
  showList,
  ref,
  buttonRef,
  onClose,
}: {
  showList: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showList &&
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [buttonRef, onClose, ref, showList]);
};
