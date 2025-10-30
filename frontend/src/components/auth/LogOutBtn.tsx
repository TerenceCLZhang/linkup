import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LogOutBtn = () => {
  const { logOut, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
      toast.success("Logged Out Successfully.");
    } catch {
      toast.error(error);
    }
  };

  return (
    <button className="button-icon-text" onClick={handleLogOut}>
      <LogOut /> Log Out
    </button>
  );
};

export default LogOutBtn;
