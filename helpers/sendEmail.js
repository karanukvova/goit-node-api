import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL, EMAIL_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465, // 25, 465, 2525
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);


const sendEmail = (email, token) => {
    const mail = {
      from: EMAIL,
      to: email,
      subject: "Verification",
      html: `<a href='http://localhost:3000/users/verify/${token}'>verify email</a>`,
    };
    return transport.sendMail(mail)
}

export default sendEmail;