import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useChatStore } from "../../store/useChatStore";
import { Image, Send, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import EmojiPicker from "emoji-picker-react";
import { useClickOutside } from "../../hooks/useClickOutside";

const ChatFormSchema = z.object({
  text: z.string().max(800).trim(),
  image: z.string(),
});

type ChatFormType = z.infer<typeof ChatFormSchema>;

const ChatInput = () => {
  const { register, handleSubmit, setValue, getValues, reset } =
    useForm<ChatFormType>({
      resolver: zodResolver(ChatFormSchema),
      defaultValues: {
        text: "",
        image: "",
      },
    });

  const [imagePreview, setImagePreview] = useState("");
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiMenuRef = useRef<HTMLDivElement | null>(null);

  const { authUser } = useAuthStore();
  const { selectedChat, sendMessage } = useChatStore();

  // -- Handle image inputs
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SZE = 20 * 1024 * 1024; // 20 MB

    if (file.size > MAX_FILE_SZE) {
      toast.error("File size must be 20MB or less.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
        setValue("image", base64Image);
      };
    } catch (error) {
      console.error("Error updating name", error);
      toast.error("Error uploading file.");
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setValue("image", "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -- Handle emoji inputs
  useClickOutside({
    ref: emojiMenuRef,
    onClose: () => setShowEmojiMenu(false),
  });

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    const currentText = getValues("text") || "";
    setValue("text", currentText + emojiData.emoji, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // -- Handle submit
  const onSubmit = async (data: ChatFormType) => {
    const { text, image } = data;

    if (!text && !imagePreview) return;

    if (text.length > 800) {
      toast.error("Message must contain 800 or less characters.");
      return;
    }

    setSending(true);

    try {
      await sendMessage(text, image);

      reset();
      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-neutral-50 p-2 rounded-lg ring-1 ring-neutral-50 ring-offset-2 flex flex-col relative">
      {imagePreview && (
        <div className="mb-4">
          <div className="bg-secondary rounded-lg p-5 w-fit relative">
            <div className="size-40 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              className="absolute right-2 top-2 p-1 rounded-full bg-red-700 text-white hover:opacity-100 hover:scale-105"
              onClick={removeImage}
              disabled={sending}
              aria-disabled={sending}
            >
              <X />
            </button>
          </div>
        </div>
      )}

      <form
        className="flex-row w-full max-w-full gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Text */}
        <fieldset className="fieldset flex-1">
          <label htmlFor="text" className="sr-only">
            Text
          </label>
          <textarea
            id="text"
            placeholder={`Send a message to ${
              selectedChat?.isGroupChat
                ? selectedChat.chatName
                : selectedChat?.users.find((u) => u._id !== authUser?._id)?.name
            }`}
            className="border-neutral-200 resize-none"
            rows={1}
            disabled={sending}
            aria-disabled={sending}
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            {...register("text")}
          />
        </fieldset>

        <div className="flex gap-3">
          <button
            type="button"
            aria-label="Emoji picker"
            className="bg-transparent duration-0"
            onClick={() => setShowEmojiMenu(!showEmojiMenu)}
            disabled={sending}
            aria-disabled={sending}
            title="Emoji picker"
          >
            <Smile />
          </button>

          {showEmojiMenu && (
            <div className="absolute bottom-18 right-0" ref={emojiMenuRef}>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <label
            htmlFor="image-upload"
            className="cursor-pointer hover:opacity-50"
            aria-label="Upload image"
          >
            <Image className="w-7 h-7" />
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={sending}
              aria-disabled={sending}
              title="Upload an image"
            />
          </label>

          <button
            type="submit"
            aria-label="Send message"
            className="bg-transparent duration-0"
            disabled={sending}
            title="Send"
          >
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
