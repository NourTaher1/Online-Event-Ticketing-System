import nodemailer from "nodemailer";
import secrets from "../config/secrets.js";

export default async function sendEmail({ to, subject, text }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: secrets.EMAIL_USER,
        pass: secrets.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: secrets.EMAIL_USER,
      to,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
