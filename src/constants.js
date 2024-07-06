import nodemailer from "nodemailer";

export const DB_NAME = "POMO_SUPER_FOCUS_DB";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_APPLICATION_SPECIFIC_EMAIL,
    pass: process.env.NODEMAILER_APPLICATION_SPECIFIC_PASSCODE,
  },
});

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const cookieOptions = {
  httpOnly: true,
  secure: true,
};
