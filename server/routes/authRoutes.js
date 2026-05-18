const express = require('express')
const router = express.Router()
const {register, login, logout, refresh} = require("../controllers/authController")
const { route } = require('../server')
const { protect } = require("../middleware/authMiddleware")

router.post("/register", register)
router.post("/login", login)
router.post('/logout', protect, logout)
router.post('/refresh', refresh)

module.exports = router