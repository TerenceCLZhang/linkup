import { Navigate } from "react-router-dom";
import ResendVerificationEmail from "../../components/auth/ResendVerificationEmail";
import VerifyEmailForm from "../../components/auth/VerifyEmailForm";
import { useAuthStore } from "../../store/useAuthStore";

const VerifyEmailPage = () => {
  const { authUser } = useAuthStore();

  if (authUser && authUser.isVerified)
    return <Navigate to={"/messages"} replace />;

  if (!authUser) return <Navigate to={"/login"} replace />;

  return (
    <div className="text-center space-y-10">
      <div className="space-y-2">
        <h2 className="text-4xl">Verify Your Email</h2>
        <p>Enter the 6-digit code sent to your email address.</p>
      </div>

      <VerifyEmailForm />

      <ResendVerificationEmail />
    </div>
  );
};

export default VerifyEmailPage;
