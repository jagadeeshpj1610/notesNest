const User = require('../models/userModel')
const Note = require('../models/noteModel')
const cloudinary = require('../config/cloudinary')

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken -resetOTP -resetOTPExpiry')
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({ user })
    } catch (error) {
        console.log("Get profile error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { getMyProfile }