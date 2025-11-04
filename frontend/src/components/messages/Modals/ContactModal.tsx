import { useState } from "react";
import { useChatStore } from "../../../store/useChatStore";
import Modal from "../../ui/Modal";
import FormSubmitBtn from "../../ui/FormSubmitBtn";

const ContactModal = ({
  setShowContactModal,
}: {
  setShowContactModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [email, setEmail] = useState("");
  const { addContact, isLoading } = useChatStore();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addContact(email.trim());
      setShowContactModal(false);
    } catch (error) {
      console.error("Error adding new contact", error);
    }
  };

  return (
    <Modal onClose={() => setShowContactModal(false)}>
      <h2 className="text-3xl mb-5">Add New Contact</h2>
      <form className="space-y-3" onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            aria-disabled={isLoading}
          />
        </fieldset>
        <FormSubmitBtn
          loadingText="Creating Contact"
          notLoadingText="Create Contact"
          disabled={
            !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
          }
        />
      </form>
    </Modal>
  );
};

export default ContactModal;
