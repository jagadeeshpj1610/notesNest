import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadNoteApi } from '../api/notesApi'
import { useAuth } from '../context/AuthContext'
import styles from './UploadNotePage.module.css'

const UploadNotePage = () => {
    const { accessToken } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ title: '', subject: '', description: '', tags: '' })
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return setError('Please select a file.')
        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', form.title)
        formData.append('subject', form.subject)
        formData.append('description', form.description)
        formData.append('tags', form.tags)

        const res = await uploadNoteApi(formData, accessToken)
        if (res._id) {
            navigate(`/notes/${res._id}`)
        } else {
            setError(res.message || 'Upload failed.')
        }
        setLoading(false)
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.heading}>Upload Note 📤</h1>
                <p className={styles.sub}>Share your notes with the community</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Title *</label>
                        <input
                            className={styles.input}
                            name="title"
                            placeholder="e.g. Calculus Chapter 3 Notes"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Subject *</label>
                        <input
                            className={styles.input}
                            name="subject"
                            placeholder="e.g. Mathematics"
                            value={form.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            name="description"
                            placeholder="Brief description of the notes..."
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Tags</label>
                        <input
                            className={styles.input}
                            name="tags"
                            placeholder="e.g. calculus, integration, math (comma-separated)"
                            value={form.tags}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>File *</label>
                        <div className={styles.fileZone} onClick={() => document.getElementById('fileInput').click()}>
                            {file ? (
                                <span className={styles.fileName}>📄 {file.name}</span>
                            ) : (
                                <>
                                    <span className={styles.fileIcon}>📁</span>
                                    <span>Click to select file (PDF, DOCX, etc.)</span>
                                </>
                            )}
                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={e => setFile(e.target.files[0])}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        />
                    </div>

                    <button className={styles.btn} type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Note'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UploadNotePage