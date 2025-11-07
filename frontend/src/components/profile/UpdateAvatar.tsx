import { useAuthStore } from "../../store/useAuthStore";
import ImageUploaderCircle from "../ui/ImageUploaderCircle";

const UpdateAvatar = () => {
  const { authUser, isUpdatingAvatar, updateAvatar } = useAuthStore();

  return (
    <ImageUploaderCircle
      currentImage={authUser?.avatar}
      defaultImage="/default_avatar.svg"
      onUpload={updateAvatar}
      isUploading={isUpdatingAvatar}
    />
  );
};

export default UpdateAvatar;
