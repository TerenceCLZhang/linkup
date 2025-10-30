import { Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import LogOutBtn from "./auth/LogOutBtn";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { authUser } = useAuthStore();

  return (
    <header className="container fixed w-full">
      <div className="flex items-center justify-between py-5">
        <h1 className="text-2xl font-bold h-15 p-1">
          <a href="/" className="flex items-center h-full gap-2">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-full w-auto object-contain"
            />
            <h1>
              Link<span className="text-primary">Up</span>
            </h1>
          </a>
        </h1>

        <div className="flex gap-3">
          {authUser && (
            <>
              <button>
                <Link to={"/profile"} className="button-icon-text">
                  <User /> Profile
                </Link>
              </button>

              <LogOutBtn />
            </>
          )}

          <button type="button" aria-label="Settings" title="Settings">
            <Settings />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
