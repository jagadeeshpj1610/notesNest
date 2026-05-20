const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const noteStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'notenest/notes',
        allowed_formats: ['pdf'],
        resource_type: 'raw',
    }
})

const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'notenest/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        resource_type: 'image',
    }
})

const uploadNote = multer({ storage: noteStorage })
const uploadAvatar = multer({ storage: avatarStorage })

module.exports = { uploadNote, uploadAvatar }