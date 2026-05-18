const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: String, required: true, trim: true },
    },
    { timestamps: true }
)

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        subject: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        fileUrl: { type: String, required: true },
        filePublicId: { type: String, required: true },
        uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        tags: [{ type: String, trim: true }],
        downloads: { type: Number, default: 0 },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        comments: [commentSchema],
        isOriginal: { type: Boolean, required: true },
        sourceName: { type: String, trim: true },
        sourceUrl: { type: String, trim: true },
        copyrightAcknowledged: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
)

const Note = mongoose.model('Note', noteSchema)
module.exports = Note