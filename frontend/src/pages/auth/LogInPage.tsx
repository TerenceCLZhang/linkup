import { Link } from "react-router-dom";
import LogInForm from "../../components/auth/LogInForm";
import AuthChatExample from "../../components/ui/AuthChatExample";

const LogInPage = () => {
  return (
    <div className="container flex justify-between items-center gap-10 w-screen x-padding">
      <div className="flex-1 space-y-5 flex flex-col items-center justify-center">
        <div className="space-y-3 text-center">
          <h2 className="text-4xl">Log In</h2>
          <p>Hey there! Great to see you again.</p>
        </div>

        <LogInForm />

        <p className="mt-5">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold link-blue">
            Sign Up
          </Link>
        </p>
      </div>

      <AuthChatExample />
    </div>
  );
};

export default LogInPage;
