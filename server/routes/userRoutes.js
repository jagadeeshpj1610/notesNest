const express = require('express')
const router = express.Router()
const { getMyProfile, updateProfile, uploadAvatar } = require('../controllers/userController')
const { uploadAvatar: uploadAvatarMiddleware } = require('../middleware/uploadMiddleware')
const { protect } = require('../middleware/authMiddleware')

router.get('/me', protect, getMyProfile)
router.put('/me', protect, updateProfile )
router.put('/me/avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar)

module.exports = router