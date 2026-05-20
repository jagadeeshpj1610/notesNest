const express = require('express')
const router = express.Router()
const { uploadNote } = require('../middleware/uploadMiddleware')
const {searchNotes, filterBySubject} = require('../controllers/searchController')
const { uploadNote: uploadNoteController, getAllNotes, getSingleNote, deleteNote, likeNote, saveNote, addComment, downloadNote } = require('../controllers/notesController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, uploadNote.single('file'), uploadNoteController)
router.get('/', getAllNotes)
router.get('/search', searchNotes)
router.get('/filter', filterBySubject)
router.get('/:id', getSingleNote)
router.delete('/:id', protect, deleteNote)
router.post('/:id/like', protect, likeNote)
router.post('/:id/save', protect, saveNote)
router.post('/:id/comment', protect, addComment)
router.get('/:id/download', protect, downloadNote)

module.exports = router