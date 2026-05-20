import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { likeNoteApi, saveNoteApi } from '../api/notesApi'
import { useState } from 'react'
import styles from './NoteCard.module.css'

const NoteCard = ({ note, onLike, onSave }) => {
    const { user, accessToken } = useAuth()
    const navigate = useNavigate()
    const [likeLoading, setLikeLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)

    const isLiked = note.likes?.includes(user?.id)
    const isSaved = note.saves?.includes(user?.id)

    const handleLike = async (e) => {
        e.stopPropagation()
        if (!user) return navigate('/login')
        setLikeLoading(true)
        const res = await likeNoteApi(note._id, accessToken)
        if (res.likes !== undefined) onLike && onLike(note._id, res.likes)
        setLikeLoading(false)
    }

    const handleSave = async (e) => {
        e.stopPropagation()
        if (!user) return navigate('/login')
        setSaveLoading(true)
        const res = await saveNoteApi(note._id, accessToken)
        if (res.saves !== undefined) onSave && onSave(note._id, res.saves)
        setSaveLoading(false)
    }

    return (
        <div className={styles.card} onClick={() => navigate(`/notes/${note._id}`)}>
            <div className={styles.top}>
                <h3 className={styles.title}>{note.title}</h3>
                <span className={styles.subject}>{note.subject}</span>
            </div>

            {note.description && (
                <p className={styles.desc}>{note.description}</p>
            )}

            {note.tags?.length > 0 && (
                <div className={styles.tags}>
                    {note.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>#{tag}</span>
                    ))}
                </div>
            )}

            <div className={styles.bottom}>
                <span className={styles.uploader}>
                    {note.uploader?.avatar && (
                        <img src={note.uploader.avatar} alt="avatar" className={styles.avatar} />
                    )}
                    {note.uploader?.name}
                </span>

                <div className={styles.actions}>
                    <button
                        onClick={handleLike}
                        className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
                        disabled={likeLoading}
                    >
                        ❤️ {note.likes?.length || 0}
                    </button>

                    <button
                        onClick={handleSave}
                        className={`${styles.actionBtn} ${isSaved ? styles.saved : ''}`}
                        disabled={saveLoading}
                    >
                        🔖 {note.saves?.length || 0}
                    </button>

                    <span className={styles.downloads}>⬇️ {note.downloads}</span>
                </div>
            </div>
        </div>
    )
}

export default NoteCard