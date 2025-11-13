import { Bell, BellOff, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import LogOutBtn from "./auth/LogOutBtn";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import DropDownList from "./ui/DropDownList";
import { useChatStore } from "../store/useChatStore";
import { motion } from "framer-motion";

const Header = () => {
  const { authUser } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();

  const [showList, setShowList] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

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

        {authUser && (
          <div className="flex gap-5 relative">
            <button
              type="button"
              className="p-0 bg-transparent"
              title={`${isSoundEnabled ? "Disable" : "Enable"} sound`}
              onClick={toggleSound}
            >
              {isSoundEnabled ? <Bell /> : <BellOff />}
            </button>

            <button
              type="button"
              className="bg-transparent"
              onClick={() => setShowList(!showList)}
              ref={buttonRef}
              aria-haspopup="menu"
              aria-expanded={showList}
              aria-controls="menu"
              aria-label="Menu with edit profile or logout"
            >
              <div className="size-12 overflow-hidden rounded-full">
                <img
                  src={authUser.avatar}
                  alt="Your avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </button>

            {showList && (
              <DropDownList
                onClose={() => setShowList(false)}
                buttonRef={buttonRef}
                showList={showList}
                width={50}
              >
                <button
                  type="button"
                  className="button-padding p-1"
                  onClick={() => setShowList(false)}
                >
                  <Link to={"/profile"} className="button-icon-text">
                    <User /> Profile
                  </Link>
                </button>

                <LogOutBtn />
              </DropDownList>
            )}
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
