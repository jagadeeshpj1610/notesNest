const express = require('express')
const router = express.Router()
const { uploadNote, getAllNotes, getSingleNote, deleteNote, likeNote, saveNote, addComment, downloadNote } = require('../controllers/notesController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.post('/', protect, upload.single('file'), uploadNote)
router.get('/', getAllNotes)
router.get('/:id', getSingleNote)
router.delete('/:id', protect, deleteNote)
router.post('/:id/like', protect, likeNote)
router.post('/:id/save', protect, saveNote)
router.post('/:id/comment', protect, addComment)
router.get('/:id/download', protect, downloadNote)

module.exports = router