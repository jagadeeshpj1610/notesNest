const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['student', 'admin'], default: 'student' },
        isEmailVerified: { type: Boolean, default: false },
        avatar: { type: String, default: '' },
        avatarPublicId: { type: String, default: '' },
        bio: { type: String, trim: true, default: '' },
        xp: { type: Number, default: 0 },
        badges: [{ type: String }],
        streak: { type: Number, default: 0 },
        lastActiveDate: { type: Date },
        resetOTP: { type: String },
        resetOTPExpiry: { type: Date },
        refreshToken: { type: String },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User