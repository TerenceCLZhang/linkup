import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useChatStore } from "../../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const ChatFormSchema = z.object({
  text: z.string().max(800).trim(),
  image: z.string(),
});

type ChatFormType = z.infer<typeof ChatFormSchema>;

const ChatInput = () => {
  const { register, handleSubmit, setValue } = useForm<ChatFormType>({
    resolver: zodResolver(ChatFormSchema),
    defaultValues: {
      text: "",
      image: "",
    },
  });

  const [imagePreview, setImagePreview] = useState("");
  const { selectedUser, sendMessage } = useChatStore();

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
  };

  const onSubmit = async (data: ChatFormType) => {
    const { text, image } = data;

    if (!text && !imagePreview) return;

    if (text.length > 800) {
      toast.error("Message must contain 800 or less characters.");
      return;
    }

    try {
      await sendMessage(text, image);

      setValue("text", "");
      setValue("image", "");
      setImagePreview("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="bg-neutral-50 p-2 rounded-lg ring-1 ring-neutral-50 ring-offset-2 flex flex-col">
      {imagePreview && (
        <div className="mb-4">
          <div className="bg-secondary rounded-lg p-5 w-fit relative">
            <div className="size-40 rounded-lg overflow-hidden">
              <img src={imagePreview} alt="Preview" />
            </div>

            <button
              type="button"
              className="absolute right-2 top-2 p-1 rounded-full bg-red-700 text-white hover:opacity-100 hover:scale-105"
              onClick={removeImage}
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
          <input
            id="text"
            type="text"
            placeholder={`Send a message to ${selectedUser?.name}`}
            className="border-neutral-200"
            {...register("text")}
          />
        </fieldset>

        <div className="flex gap-3">
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
              onChange={handleImageChange}
            />
          </label>

          <button
            type="submit"
            aria-label="Send message"
            className="bg-transparent p-0 duration-0"
          >
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
