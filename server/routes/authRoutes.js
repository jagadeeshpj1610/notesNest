const express = require('express')
const router = express.Router()
const {register, login, logout, refresh, verifyOTP} = require("../controllers/authController")

const { protect } = require("../middleware/authMiddleware")

router.post("/register", register)
router.post("/login", login)
router.post('/logout', protect, logout)
router.post('/refresh', refresh)
router.post('/verify-otp', verifyOTP)

module.exports = router