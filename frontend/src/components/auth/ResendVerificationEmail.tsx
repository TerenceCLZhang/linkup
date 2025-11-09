import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const ResendVerificationEmail = () => {
  const [cooldown, setCooldown] = useState(1);
  const [sending, setSending] = useState(false);
  const { resendVerifcationEmail } = useAuthStore();

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerifcationEmail();
      setCooldown(60);
    } catch (error) {
      console.error("Error resending verifcation email", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="text-sm flex justify-center">
      {cooldown > 0 ? (
        <span>
          Resend available in <strong>{cooldown}</strong> seconds
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className={`bg-transparent  text-primary ${
            !sending && "hover:underline hover:opacity-100"
          }`}
          disabled={sending}
        >
          {sending
            ? "Resending Verification Email"
            : "Resend Verfication Email"}
        </button>
      )}
    </div>
  );
};

export default ResendVerificationEmail;
