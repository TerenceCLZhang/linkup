import { Link } from "react-router-dom";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="text-center space-y-7 max-w-lg">
      <h2 className="text-4xl">Forgot Password</h2>

      {!submitted ? (
        <>
          <p>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <ForgotPasswordForm setSubmitted={setSubmitted} />
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex items-center justify-center bg-primary text-secondary w-25 h-25 rounded-full">
            <Mail className="size-15" />
          </div>
          <p>
            We’ve sent you an email with a password reset link. It should arrive
            in your inbox shortly.
          </p>
        </div>
      )}

      <button type="button" className="flex mx-auto button-padding">
        <Link to={"/login"} className="button-icon-text">
          <ArrowLeft /> Back to Log In
        </Link>
      </button>
    </div>
  );
};

export default ForgotPasswordPage;
