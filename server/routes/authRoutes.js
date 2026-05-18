const express = require('express')
const router = express.Router()
const {register, login, logout} = require("../controllers/authController")
const { route } = require('../server')
const { protect } = require("../middleware/authMiddleware")

router.post("/register", register)
router.post("/login", login)
router.post('/logout', protect, logout)

module.exports = router