// const nodemailer = require("nodemailer");
// const sgTransport = require('nodemailer-sendgrid-transport');

// require("dotenv").config();

// const transporter = nodemailer.createTransport(sgTransport({
//   auth: {
//     api_key: process.env.SENDGRID_API_KEY
//   }
// }));




const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

function sendMail(toEmail, subject, content) {
  try {
    const mailOptions = {
      from: `HetroCritic <support@HetroCritic.org>`,
      to: toEmail,
      subject: subject,
      html: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error during transport: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
  } catch (e) {
    console.error("Error during sendMail: ", e);
  }
}

module.exports = { sendMail };
