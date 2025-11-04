import { sendEmail } from "./email.js";

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
) => {
  try {
    await sendEmail({
      to: email,
      name,
      subject: "LinkUp - Verify your Email",
      text: `Your verification code is: ${token}.\n\nEnter this code on the verification page to complete your registration.\n\nThis code will expire in 1 day.`,
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
  }
};
