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

const updateProfile = async (req, res) => {
    try {
        const { name, bio } = req.body

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, bio },
            { new: true }
        ).select('-password -refreshToken -resetOTP -resetOTPExpiry')

        res.status(200).json({ message: "Profile updated", user })

    } catch (error) {
        console.log("Update profile error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" })
        }

        const user = await User.findById(req.user.id)

        // Delete old avatar from cloudinary if exists
        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId)
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                avatar: req.file.path,
                avatarPublicId: req.file.filename,
            },
            { new: true }
        ).select('-password -refreshToken -resetOTP -resetOTPExpiry')

        res.status(200).json({ message: "Avatar uploaded", user: updatedUser })

    } catch (error) {
        console.log("Upload avatar error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -refreshToken -resetOTP -resetOTPExpiry -email')

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ user })

    } catch (error) {
        console.log("Get user error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { getMyProfile , updateProfile, uploadAvatar, getUserById }