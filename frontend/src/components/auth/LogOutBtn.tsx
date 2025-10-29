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
    } catch {
      toast.error(error);
    }
  };

  return (
    <button className="inline-flex gap-2" onClick={handleLogOut}>
      <LogOut /> Log Out
    </button>
  );
};

export default LogOutBtn;
