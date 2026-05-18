const transporter = require('../config/nodemailer')

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"NoteNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your NoteNest account",
        html: `
            <h2>Welcome to NoteNest!</h2>
            <p>Your OTP for email verification is:</p>
            <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP expires in <strong>10 minutes</strong>.</p>
            <p>If you didn't create a NoteNest account, ignore this email.</p>
        `
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendOTPEmail