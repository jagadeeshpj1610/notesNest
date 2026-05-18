const User = require("../models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendOTPEmail = require('../utils/sendOtpEmail')
const { use } = require("../config/nodemailer")


const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    )
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fileds are required" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: "email already registered" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const otp = generateOTP()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
        const user = await User.create({
            name, email, password: hashedPassword,
            resetOTP: otp,
            resetOTPExpiry: otpExpiry
        })

        await sendOTPEmail(email, otp)

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        await User.findByIdAndUpdate(user._id, { refreshToken })

        res.status(201).json({
            message: "Registration successful. OTP sent to your email.",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        })
    } catch (error) {
        console.log("Register error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email already verified" })
        }

        if (user.resetOTP !== otp) {
            return res.status(400).json({ message: "Invalid OTP" })
        }

        if (user.resetOTPExpiry < new Date()) {
            return res.status(400).json({ message: "OTP expired" })
        }

        await User.findByIdAndUpdate(user._id, {
            isEmailVerified: true,
            resetOTP: null,
            resetOTPExpiry: null,
        })

        res.status(200).json({ message: "Email verified successfully" })

    } catch (error) {
        console.log("OTP verify error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "all fileds are required!" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        await User.findByIdAndUpdate(user._id, { refreshToken })

        res.status(200).json({
            message: "Login sucessfull",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error) {
        console.log("Login error", error);
        res.status(500).json({ message: "server error" })
    }
}

const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { refreshToken: "" })
        res.status(200).json({ message: "Logout Successful" })
    } catch (error) {
        console.log("Logout Error", error);
        res.status(500).json({ message: "server error" })
    }
}




const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token" })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await User.findById(decoded.id)
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken })

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        })


    } catch (error) {
        console.log("Refresh error", error)
        res.status(403).json({ message: "Invalid or expired refresh token" })
    }
}

module.exports = { register, login, logout, refresh, verifyOTP }