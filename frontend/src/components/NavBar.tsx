import { Settings } from "lucide-react";

const NavBar = () => {
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
          <button
            type="button"
            className="btn p-2"
            aria-label="Settings"
            title="Settings"
          >
            <Settings />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
