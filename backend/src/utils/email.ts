import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.EMAIL,
    pass: ENV.EMAIL_PASS,
  },
});

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const textToHtml = (txt: string) =>
  txt
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeHtml(para).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");

export const sendEmail = async ({
  to,
  name,
  subject,
  text,
}: {
  to: string;
  name: string;
  subject: string;
  text: string;
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html: `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.5; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        
      <p style="font-size: 16px;">Hi ${escapeHtml(name)},</p>

      ${textToHtml(text)}

      <p style="margin-top: 24px; font-size: 13px; color: #888;">
        If you did not request this, please ignore this email.
      </p>
    </div>
    `,
  });
};
