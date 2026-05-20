import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUserByIdApi } from '../api/userApi'
import { getAllNotesApi } from '../api/notesApi'
import NoteCard from '../components/NoteCard'
import styles from './UserProfilePage.module.css'

const UserProfilePage = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            const [user, allNotes] = await Promise.all([
                getUserByIdApi(id),
                getAllNotesApi(),
            ])
            setProfile(user)
            const userNotes = Array.isArray(allNotes)
                ? allNotes.filter(n => n.uploader?._id === id || n.uploader === id)
                : []
            setNotes(userNotes)
            setLoading(false)
        }
        fetchAll()
    }, [id])

    const handleLike = (noteId, likes) => setNotes(prev => prev.map(n => n._id === noteId ? { ...n, likes } : n))
    const handleSave = (noteId, saves) => setNotes(prev => prev.map(n => n._id === noteId ? { ...n, saves } : n))

    if (loading) return <div className={styles.status}>Loading...</div>
    if (!profile) return <div className={styles.status}>User not found.</div>

    return (
        <div className={styles.page}>
            <div className={styles.profileCard}>
                <img
                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=4f46e5&color=fff`}
                    alt="avatar"
                    className={styles.avatar}
                />
                <div className={styles.info}>
                    <h1 className={styles.name}>{profile.name}</h1>
                    {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
                    <div className={styles.stats}>
                        <span>📝 {notes.length} Notes uploaded</span>
                    </div>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>Notes by {profile.name}</h2>

            {notes.length === 0 ? (
                <div className={styles.empty}>No notes uploaded yet.</div>
            ) : (
                <div className={styles.grid}>
                    {notes.map(note => (
                        <NoteCard key={note._id} note={note} onLike={handleLike} onSave={handleSave} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserProfilePage