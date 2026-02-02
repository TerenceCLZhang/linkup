import Modal from "./Modal";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  confirmButtonClass?: string;
}

const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  confirmButtonClass = "bg-red-500 hover:bg-red-600",
}: ConfirmModalProps) => {
  return (
    <Modal onClose={onClose}>
      <div className="text-center w-full">
        <h2 className="text-2xl mb-4">{title}</h2>
        <p className="text-neutral-600 mb-8">{message}</p>
        <div className="flex justify-center gap-4 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 rounded-lg text-white transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
