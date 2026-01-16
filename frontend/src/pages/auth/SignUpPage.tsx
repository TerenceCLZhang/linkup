import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";
import AuthChatExample from "../../components/ui/AuthChatExample";

const SignUpPage = () => {
  return (
    <div className="container flex justify-between items-center gap-10 w-full x-padding grow">
      <div className="flex-1 space-y-5 flex flex-col items-center justify-center w-full">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl md:text-4xl">Sign Up</h2>
          <p className="text-sm md:text-base">Let’s get you linked up!</p>
        </div>

        <SignUpForm />

        <p className="mt-5 text-sm md:text-base">
          Already have an account?{" "}
          <Link to="/login" className="font-bold link-blue">
            Log In
          </Link>
        </p>
      </div>
      <div className="hidden min-[1100px]:flex flex-1">
        <AuthChatExample />
      </div>
    </div>
  );
};

export default SignUpPage;
