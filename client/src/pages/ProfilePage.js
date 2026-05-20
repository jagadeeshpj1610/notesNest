import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyProfileApi, updateProfileApi, uploadAvatarApi, getMyNotesApi, getMySavedNotesApi } from '../api/userApi'
import NoteCard from '../components/NoteCard'
import styles from './ProfilePage.module.css'

const ProfilePage = () => {
    const { accessToken, setUser } = useAuth()
    const [profile, setProfile] = useState(null)
    const [myNotes, setMyNotes] = useState([])
    const [savedNotes, setSavedNotes] = useState([])
    const [tab, setTab] = useState('notes')
    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState({ name: '', bio: '' })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const fetchAll = async () => {
            const [prof, notes, saved] = await Promise.all([
                getMyProfileApi(accessToken),
                getMyNotesApi(accessToken),
                getMySavedNotesApi(accessToken),
            ])
            setProfile(prof)
            setForm({ name: prof.name || '', bio: prof.bio || '' })
            setMyNotes(Array.isArray(notes) ? notes : [])
            setSavedNotes(Array.isArray(saved) ? saved : [])
            setLoading(false)
        }
        fetchAll()
    }, [accessToken])

    const handleUpdate = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        const res = await updateProfileApi(form, accessToken)
        if (res._id) {
            setProfile(res)
            setUser(res)
            localStorage.setItem('user', JSON.stringify(res))
            setEditMode(false)
            setSuccess('Profile updated!')
            setTimeout(() => setSuccess(''), 2500)
        } else {
            setError(res.message || 'Update failed.')
        }
        setSaving(false)
    }

    const handleAvatar = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        const formData = new FormData()
        formData.append('avatar', file)
        const res = await uploadAvatarApi(formData, accessToken)
        if (res.avatar) {
            setProfile(prev => ({ ...prev, avatar: res.avatar }))
            setUser(prev => ({ ...prev, avatar: res.avatar }))
        }
    }

    const handleLike = (id, likes) => {
        setMyNotes(prev => prev.map(n => n._id === id ? { ...n, likes } : n))
        setSavedNotes(prev => prev.map(n => n._id === id ? { ...n, likes } : n))
    }

    const handleSave = (id, saves) => {
        setMyNotes(prev => prev.map(n => n._id === id ? { ...n, saves } : n))
        setSavedNotes(prev => prev.map(n => n._id === id ? { ...n, saves } : n))
    }

    if (loading) return <div className={styles.status}>Loading...</div>

    return (
        <div className={styles.page}>
            <div className={styles.profileCard}>
                <div className={styles.avatarWrap}>
                    <img
                        src={profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.name}&background=4f46e5&color=fff`}
                        alt="avatar"
                        className={styles.avatar}
                    />
                    <label className={styles.avatarEdit} title="Change avatar">
                        📷
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
                    </label>
                </div>

                {!editMode ? (
                    <div className={styles.info}>
                        <h1 className={styles.name}>{profile?.name}</h1>
                        <p className={styles.email}>{profile?.email}</p>
                        {profile?.bio && <p className={styles.bio}>{profile.bio}</p>}
                        <div className={styles.stats}>
                            <span>📝 {myNotes.length} Notes</span>
                            <span>🔖 {savedNotes.length} Saved</span>
                        </div>
                        <button className={styles.editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className={styles.editForm}>
                        {error && <div className={styles.error}>{error}</div>}
                        <input
                            className={styles.input}
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Name"
                            required
                        />
                        <textarea
                            className={styles.textarea}
                            value={form.bio}
                            onChange={e => setForm({ ...form, bio: e.target.value })}
                            placeholder="Bio (optional)"
                            rows={3}
                        />
                        <div className={styles.editActions}>
                            <button className={styles.saveBtn} type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button className={styles.cancelBtn} type="button" onClick={() => setEditMode(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
                {success && <div className={styles.success}>{success}</div>}
            </div>

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${tab === 'notes' ? styles.active : ''}`} onClick={() => setTab('notes')}>
                    My Notes ({myNotes.length})
                </button>
                <button className={`${styles.tab} ${tab === 'saved' ? styles.active : ''}`} onClick={() => setTab('saved')}>
                    Saved ({savedNotes.length})
                </button>
            </div>

            {(tab === 'notes' ? myNotes : savedNotes).length === 0 ? (
                <div className={styles.empty}>No notes here yet.</div>
            ) : (
                <div className={styles.grid}>
                    {(tab === 'notes' ? myNotes : savedNotes).map(note => (
                        <NoteCard key={note._id} note={note} onLike={handleLike} onSave={handleSave} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProfilePage