const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code for GreenTable",
        text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP Sent to:", email);
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
};

module.exports = sendOTP;
