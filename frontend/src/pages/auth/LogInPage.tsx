import { Link } from "react-router-dom";
import LogInForm from "../../components/auth/LogInForm";
import AuthChatExample from "../../components/ui/AuthChatExample";

const LogInPage = () => {
  return (
    <div className="container flex justify-between items-center gap-10 w-full x-padding grow">
      <div className="flex-1 space-y-5 flex flex-col items-center justify-center w-full">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl md:text-4xl">Log In</h2>
          <p className="text-sm md:text-base">
            Hey there! Great to see you again.
          </p>
        </div>

        <LogInForm />

        <p className="mt-5 text-sm md:text-base">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold link-blue">
            Sign Up
          </Link>
        </p>
      </div>

      <div className="hidden min-[1100px]:flex flex-1">
        <AuthChatExample />
      </div>
    </div>
  );
};

export default LogInPage;
