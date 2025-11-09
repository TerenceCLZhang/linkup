import { User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import LogOutBtn from "./auth/LogOutBtn";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavBar = () => {
  const { authUser } = useAuthStore();

  return (
    <motion.header
      className="container w-full bg-white x-padding"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
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
              <button type="button" className="button-padding">
                <Link to={"/profile"} className="button-icon-text">
                  <User /> Profile
                </Link>
              </button>

              <LogOutBtn />
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default NavBar;
