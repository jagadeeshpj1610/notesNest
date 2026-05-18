const Note = require('../models/noteModel')
const cloudinary = require('../config/cloudinary')

const uploadNote = async (req, res) => {
    try {
        const { title, subject, description, tags, isOriginal, sourceName, sourceUrl, copyrightAcknowledged } = req.body

        if (!title || !subject) {
            return res.status(400).json({ message: "Title and subject are required" })
        }

        if (!copyrightAcknowledged) {
            return res.status(400).json({ message: "You must acknowledge copyright" })
        }

        if (!isOriginal && !sourceName) {
            return res.status(400).json({ message: "Source name is required for non-original notes" })
        }

        if (!req.file) {
            return res.status(400).json({ message: "PDF file is required" })
        }

        const note = await Note.create({
            title,
            subject,
            description,
            fileUrl: req.file.path,
            filePublicId: req.file.filename,
            uploader: req.user.id,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            isOriginal,
            sourceName,
            sourceUrl,
            copyrightAcknowledged,
        })

        res.status(201).json({ message: "Note uploaded successfully", note })

    } catch (error) {
        console.log("Upload note error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find()
            .populate('uploader', 'name email')
            .sort({ createdAt: -1 })

        res.status(200).json({ notes })

    } catch (error) {
        console.log("Get notes error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getSingleNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('uploader', 'name email')
            .populate('comments.user', 'name')

        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        res.status(200).json({ note })

    } catch (error) {
        console.log("Get single note error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        if (note.uploader.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this note" })
        }

        await cloudinary.uploader.destroy(note.filePublicId, { resource_type: 'raw' })
        await Note.findByIdAndDelete(req.params.id)

        res.status(200).json({ message: "Note deleted successfully" })

    } catch (error) {
        console.log("Delete note error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const likeNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        const alreadyLiked = note.likes.includes(req.user.id)

        if (alreadyLiked) {
            note.likes = note.likes.filter(id => id.toString() !== req.user.id)
        } else {
            note.likes.push(req.user.id)
        }

        await note.save()

        res.status(200).json({ message: alreadyLiked ? "Like removed" : "Note liked", likes: note.likes.length })

    } catch (error) {
        console.log("Like note error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const saveNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        const alreadySaved = note.saves.includes(req.user.id)

        if (alreadySaved) {
            note.saves = note.saves.filter(id => id.toString() !== req.user.id)
        } else {
            note.saves.push(req.user.id)
        }

        await note.save()

        res.status(200).json({ message: alreadySaved ? "Note unsaved" : "Note saved", saves: note.saves.length })

    } catch (error) {
        console.log("Save note error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const addComment = async (req, res) => {
    try {
        const { comment } = req.body

        if (!comment) {
            return res.status(400).json({ message: "Comment is required" })
        }

        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        note.comments.push({ user: req.user.id, comment })
        await note.save()

        res.status(201).json({ message: "Comment added", comments: note.comments })

    } catch (error) {
        console.log("Add comment error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

const downloadNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        note.downloads += 1
        await note.save()

        res.status(200).json({ message: "Download counted", fileUrl: note.fileUrl })

    } catch (error) {
        console.log("Download note error", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { uploadNote, getAllNotes, getSingleNote, deleteNote, likeNote, saveNote, addComment, downloadNote }