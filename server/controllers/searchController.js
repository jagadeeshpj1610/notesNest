const Note = require('../models/noteModel')

const searchNotes = async (req, res) => {
    try {
        const { q } = req.query

        if (!q || q.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' })
        }

        const regex = new RegExp(q.trim(), 'i')

        const notes = await Note.find({
            $or: [
                { title: regex },
                { subject: regex },
                { description: regex },
                { tags: regex },
            ],
        })
            .populate('uploader', 'name avatar')
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, count: notes.length, data: notes })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const filterBySubject = async (req, res) => {
    try {
        const { subject } = req.query

        if (!subject || subject.trim() === '') {
            return res.status(400).json({ message: 'Subject is required' })
        }

        const notes = await Note.find({
            subject: new RegExp(subject.trim(), 'i'),
        })
            .populate('uploader', 'name avatar')
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, count: notes.length, data: notes })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const getPopularNotes = async (req, res) => {
    try {
        const notes = await Note.find()
            .populate('uploader', 'name avatar')
            .sort({ downloads: -1 })
            .limit(20)

        res.status(200).json({ success: true, count: notes.length, data: notes })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = { searchNotes, filterBySubject, getPopularNotes }