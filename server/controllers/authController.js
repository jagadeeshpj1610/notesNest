const User = require("../models/userModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
        const user = await User.create({
            name, email, password: hashedPassword,
        })
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error) {
        console.log("Register error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({message : "all fileds are required!"})
        }
        const user = await User.findOne({email})
        if (!user) {
           return res.status(400).json({message: "user not found"}) 
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({message : "invalid credentials"})
        }
        const token = jwt.sign(
            {id:user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        )
        res.status(200).json({
            message:"Login sucessfull",
            token,
            user:{
                id:user._id,
                name:user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error) {
        console.log("Login error", error);
        res.status(500).json({message:"server error"})
    }
}

const logout = async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {refreshToken:""})
        res.status(200).json({message:"Logout Successful"})
    } catch (error) {
        console.log("Logout Error", error);
        res.status(500).json({message: "server error"})
    }
}

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

module.exports = {register, login, logout}