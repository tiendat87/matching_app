import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Check if email configuration exists
const emailConfigured =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

if (!emailConfigured) {
  console.warn(
    "Email configuration is incomplete. Email sending will be disabled."
  );
  console.warn(
    "Please configure SMTP_HOST, SMTP_USER, and SMTP_PASS in .env file"
  );
}

const transporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export default transporter;
