import { useEffect, useState } from "react";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [timeToRedirect, setTimeToRedirect] = useState(5);

  // redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!submitted) return;

    if (timeToRedirect <= 0) {
      navigate("/login"); // redirect to login page
      return;
    }

    const interval = setInterval(() => {
      setTimeToRedirect((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, submitted, timeToRedirect]);

  return (
    <div className="text-center space-y-7 w-100 ">
      <h2 className="text-4xl">Reset Password</h2>

      {!submitted ? (
        <>
          <ResetPasswordForm setSubmitted={setSubmitted} token={token!} />
        </>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          <p>
            Your password has been sucessfully reset. You will be redirected to
            the home page in {timeToRedirect} seconds.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
