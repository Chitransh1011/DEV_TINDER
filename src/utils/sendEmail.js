const nodemailer = require("nodemailer");
const { FROM_EMAIL, APP_PASSWORD} = require("../config/serverConfig")
const transporter = nodemailer.createTransport({
 service: 'gmail',
  auth: {
    user: FROM_EMAIL, 
    pass: APP_PASSWORD
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
    console.log(info)
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = sendEmail;
