import { Camera } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  currentImage?: string | null;
  defaultImage: string;
  onUpload: (base64Image: string) => void;
  isUploading?: boolean;
  maxSizeMB?: number;
}

const ImageUploaderCircle = ({
  currentImage,
  defaultImage,
  onUpload,
  isUploading,
  maxSizeMB = 2,
}: ImageUploaderProps) => {
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = maxSizeMB * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      toast.error(`File size must be ${maxSizeMB}MB or less.`);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setUploadedAvatar(base64Image);
        onUpload(base64Image);
      };
    } catch (error) {
      console.error("Error updating name", error);
      toast.error("Error uploading file.");
    }
  };

  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <div className="rounded-full bg-neutral-300 flex items-center justify-center relative border-5 border-accent">
        <div className="rounded-full overflow-hidden">
          <img
            src={uploadedAvatar || currentImage || defaultImage}
            alt="image"
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
            disabled={isUploading}
            aria-disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-sm">
        {isUploading ? "Uploading..." : "Click the camera to update an image"}
      </p>
      <p className="text-xs italic -mt-3">(Maximum Size: 2 MB)</p>
    </div>
  );
};

export default ImageUploaderCircle;
