import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";

const UpdateAvatar = () => {
  const { authUser, isUpdatingAvatar, updateAvatar } = useAuthStore();
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    if (file.size > MAX_SIZE) {
      toast.error("File size must be 2MB or less.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const base64Image = reader.result as string;
        updateAvatar(base64Image);
        setUploadedAvatar(base64Image);
      };
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <div className="rounded-full bg-white flex items-center justify-center relative border-5 border-accent">
        <div className="rounded-full overflow-hidden">
          <img
            src={uploadedAvatar || authUser?.avatar || "/default_avatar.svg"}
            alt={`${authUser?.name || "User"}'s avatar`}
            className="object-cover size-35"
          />
        </div>

        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-accent p-2 rounded-full cursor-pointer hover:bg-accent/95 hover:scale-105 transition duration-100 ease-in"
        >
          <Camera className="w-5 h-5 text-white" />
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUpdatingAvatar}
            aria-disabled={isUpdatingAvatar}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-sm">
        {isUpdatingAvatar
          ? "Uploading..."
          : "Click the camera to update your photo"}
      </p>
      <p className="text-xs italic -mt-3">(Maximum Size: 2 MB)</p>
    </div>
  );
};

export default UpdateAvatar;
