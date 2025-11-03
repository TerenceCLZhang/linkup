import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const LogOutBtn = () => {
  const { logOut } = useAuthStore();

  const handleLogOut = async () => {
    try {
      await logOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <button className="button-icon-text" onClick={handleLogOut}>
      <LogOut /> Log Out
    </button>
  );
};

export default LogOutBtn;
