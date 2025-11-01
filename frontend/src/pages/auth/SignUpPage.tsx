import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="container flex justify-between gap-10 w-screen">
      <div className="flex-1 space-y-5 flex flex-col items-center justify-center">
        <div className="space-y-3 text-center">
          <h2 className="text-4xl">Sign Up</h2>
          <p>Let’s get you linked up!</p>
        </div>

        <SignUpForm />

        <p className="mt-5">
          Already have an account?{" "}
          <Link to="/login" className="font-bold link-blue">
            Log In
          </Link>
        </p>
      </div>
      <div className="flex-1">
        <img src="images/signup.png" alt="" />
      </div>
    </div>
  );
};

export default SignUpPage;
