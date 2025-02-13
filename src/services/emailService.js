const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send Email Function
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"SaaS Inventory" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
