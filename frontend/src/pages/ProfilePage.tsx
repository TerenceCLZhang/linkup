import { useAuthStore } from "../store/useAuthStore";
import ProfileForm from "../components/profile/ProfileForm";
import { convertDate } from "../lib/convertDate";
import UpdateAvatar from "../components/profile/UpdateAvatar";

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  return (
    <div>
      <div className="container w-125 bg-secondary  p-10 rounded-lg flex flex-col items-center justify-center gap-5">
        <div className="text-center space-y-3">
          <h2 className="text-4xl">Profile</h2>
          <span>Your profile information</span>
        </div>

        <UpdateAvatar />

        <dl className="text-sm flex gap-2">
          <dt className="font-semibold">Member Since:</dt>
          <dd>{convertDate(authUser!.createdAt.split("T")[0]) || "N/A"}</dd>
        </dl>

        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage;
