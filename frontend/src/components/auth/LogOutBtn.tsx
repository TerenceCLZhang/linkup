import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LogOutBtn = () => {
  const { logOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <button
      type="button"
      className="button-icon-text button-padding p-1"
      onClick={handleLogOut}
    >
      <LogOut /> Log Out
    </button>
  );
};

export default LogOutBtn;
