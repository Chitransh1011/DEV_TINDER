const nodemailer = require("nodemailer");
const {SMTP_USERNAME,SMTP_PASSWORD, FROM_EMAIL} = require("../config/serverConfig")
const transporter = nodemailer.createTransport({
  host: "email-smtp.ap-south-1.amazonaws.com", 
  port: 587, 
  secure: false,
  auth: {
    user: SMTP_USERNAME, 
    pass: SMTP_PASSWORD 
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL, 
      to,
      subject,
      text
    });
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = sendEmail;
