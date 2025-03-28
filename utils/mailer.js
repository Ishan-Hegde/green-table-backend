const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'GreenTable OTP Verification',
        text: `Your OTP for GreenTable is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${email}`);
    } catch (error) {
        console.error('❌ Error sending OTP:', error);
    }
};

module.exports = sendOTP;
