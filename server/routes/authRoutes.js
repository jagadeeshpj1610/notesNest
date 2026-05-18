const express = require('express')
const router = express.Router()
const {register, login, logout, refresh, verifyOTP, forgotPassword, resetPassword} = require("../controllers/authController")

const { protect } = require("../middleware/authMiddleware")

router.post("/register", register)
router.post("/login", login)
router.post('/logout', protect, logout)
router.post('/refresh', refresh)
router.post('/verify-otp', verifyOTP)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports = router