import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getSingleNoteApi, likeNoteApi, saveNoteApi, addCommentApi, deleteNoteApi, downloadNoteApi } from '../api/notesApi'
import { useAuth } from '../context/AuthContext'
import styles from './NoteDetailPage.module.css'

const NoteDetailPage = () => {
    const { id } = useParams()
    const { user, accessToken } = useAuth()
    const navigate = useNavigate()
    const [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState('')
    const [commentLoading, setCommentLoading] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            const res = await getSingleNoteApi(id)
            setNote(res)
            setLoading(false)
        }
        fetch()
    }, [id])

    const isLiked = note?.likes?.includes(user?.id)
    const isSaved = note?.saves?.includes(user?.id)

    const handleLike = async () => {
        if (!user) return navigate('/login')
        const res = await likeNoteApi(id, accessToken)
        if (res.likes !== undefined) setNote(prev => ({ ...prev, likes: res.likes }))
    }

    const handleSave = async () => {
        if (!user) return navigate('/login')
        const res = await saveNoteApi(id, accessToken)
        if (res.saves !== undefined) setNote(prev => ({ ...prev, saves: res.saves }))
    }

    const handleDownload = async () => {
        if (!user) return navigate('/login')
        const res = await downloadNoteApi(id, accessToken)
        if (res.url) window.open(res.url, '_blank')
        setNote(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }))
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete this note?')) return
        await deleteNoteApi(id, accessToken)
        navigate('/')
    }

    const handleComment = async (e) => {
        e.preventDefault()
        if (!comment.trim()) return
        if (!user) return navigate('/login')
        setCommentLoading(true)
        const res = await addCommentApi(id, comment, accessToken)
        if (res.comments) setNote(prev => ({ ...prev, comments: res.comments }))
        setComment('')
        setCommentLoading(false)
    }

    if (loading) return <div className={styles.status}>Loading...</div>
    if (!note) return <div className={styles.status}>Note not found.</div>

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{note.title}</h1>
                        <span className={styles.subject}>{note.subject}</span>
                    </div>
                    {user?.id === note.uploader?._id && (
                        <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
                    )}
                </div>

                {note.description && <p className={styles.desc}>{note.description}</p>}

                {note.tags?.length > 0 && (
                    <div className={styles.tags}>
                        {note.tags.map((t, i) => <span key={i} className={styles.tag}>#{t}</span>)}
                    </div>
                )}

                <div className={styles.uploader}>
                    <span>Uploaded by </span>
                    <Link to={`/users/${note.uploader?._id}`} className={styles.uploaderLink}>
                        {note.uploader?.avatar && <img src={note.uploader.avatar} alt="" className={styles.avatar} />}
                        {note.uploader?.name}
                    </Link>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleLike} className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}>
                        ❤️ {note.likes?.length || 0} Like
                    </button>
                    <button onClick={handleSave} className={`${styles.actionBtn} ${isSaved ? styles.saved : ''}`}>
                        🔖 {note.saves?.length || 0} Save
                    </button>
                    <button onClick={handleDownload} className={styles.actionBtn}>
                        ⬇️ {note.downloads || 0} Download
                    </button>
                </div>

                {note.fileUrl && (
                    <div className={styles.preview}>
                        <iframe src={note.fileUrl} title="Note Preview" className={styles.iframe} />
                    </div>
                )}
            </div>

            <div className={styles.commentsSection}>
                <h2 className={styles.commentsHeading}>Comments ({note.comments?.length || 0})</h2>

                <form onSubmit={handleComment} className={styles.commentForm}>
                    <input
                        className={styles.commentInput}
                        placeholder={user ? 'Add a comment...' : 'Login to comment'}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        disabled={!user}
                    />
                    <button className={styles.commentBtn} type="submit" disabled={commentLoading || !user}>
                        {commentLoading ? '...' : 'Post'}
                    </button>
                </form>

                <div className={styles.comments}>
                    {note.comments?.length === 0 && <p className={styles.noComments}>No comments yet.</p>}
                    {note.comments?.map((c, i) => (
                        <div key={i} className={styles.comment}>
                            <div className={styles.commentUser}>
                                {c.user?.avatar && <img src={c.user.avatar} alt="" className={styles.commentAvatar} />}
                                <Link to={`/users/${c.user?._id}`} className={styles.commentName}>{c.user?.name}</Link>
                            </div>
                            <p className={styles.commentText}>{c.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NoteDetailPage