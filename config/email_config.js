const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "f477siddharth@gmail.com",
        pass: "woxp yhla mtks hljp",
    },
    secure: true,
});

const sendOtp = (to, subject, html) => {
    const mailData = {
        from: "f477siddharth@gmail.com",
        to: to,
        subject: subject,
        html: html,
    }
    transporter.sendMail(mailData);
}

module.exports = sendOtp;
