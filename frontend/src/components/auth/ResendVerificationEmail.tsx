import { useEffect, useState } from "react";

const ResendVerificationEmail = () => {
  const [cooldown, setCooldown] = useState(60);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    // TODO: call resend email API here

    setCooldown(60); // start 60s cooldown
  };

  return (
    <div className="text-sm">
      {cooldown > 0 ? (
        <span>
          Resend available in <strong>{cooldown}</strong> seconds
        </span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className="bg-transparent p-0 text-primary hover:underline hover:opacity-100"
        >
          Resend Verfication Email
        </button>
      )}
    </div>
  );
};

export default ResendVerificationEmail;
