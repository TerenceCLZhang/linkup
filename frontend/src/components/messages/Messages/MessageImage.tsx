import { Download, SquareArrowOutUpRight, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useClickOutsideImageModal } from "../../../hooks/useClickOutside";

const MessageImage = ({ image }: { image: string }) => {
  const [imageOpened, setImageOpened] = useState(false);

  const imageRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  useClickOutsideImageModal({
    imageRef,
    buttonsRef,
    onClose: () => setImageOpened(false),
  });

  // Needed as image url is different from current client url
  const handleDownload = async () => {
    try {
      const response = await fetch(image, { mode: "cors" });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a temp url to download image
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.download = image.split("/").pop() || "image";
      document.body.appendChild(tempLink);
      tempLink.click();
      tempLink.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image", error);
      toast.error("Unable to download image.");
    }
  };

  return (
    <>
      <button
        type="button"
        className="mx-auto rounded-lg overflow-hidden"
        onClick={() => setImageOpened(true)}
      >
        <img
          src={image}
          alt="Message image"
          className="w-full h-full object-cover"
        />
      </button>

      {imageOpened && (
        <>
          <div className="bg-black/90 absolute top-0 left-0 h-screen w-screen z-20" />

          <div
            className="z-40 absolute top-10 right-10 flex gap-5 items-center rounded-lg"
            ref={buttonsRef}
          >
            <button
              className="message-img-btn"
              title="Download image"
              onClick={handleDownload}
            >
              <Download />
            </button>

            <button className="message-img-btn" title="Open in new tab">
              <Link to={image} target="_blank">
                <SquareArrowOutUpRight />
              </Link>
            </button>

            <button
              className="message-img-btn"
              onClick={() => setImageOpened(false)}
              title="Close"
            >
              <X />
            </button>
          </div>

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            ref={imageRef}
          >
            <img
              src={image}
              alt="Message image"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
            />
          </div>
        </>
      )}
    </>
  );
};

export default MessageImage;
