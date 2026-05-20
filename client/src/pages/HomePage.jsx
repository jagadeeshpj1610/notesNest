import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPopularNotesApi, getRecentNotesApi } from '../api/searchApi'
import NoteCard from '../components/NoteCard'
import styles from './HomePage.module.css'

const HomePage = () => {
    const [popular, setPopular] = useState([])
    const [recent, setRecent] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('popular')

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)
            const [pop, rec] = await Promise.all([
                getPopularNotesApi(),
                getRecentNotesApi(),
            ])
            setPopular(Array.isArray(pop) ? pop : [])
            setRecent(Array.isArray(rec) ? rec : [])
            setLoading(false)
        }
        fetchAll()
    }, [])

    const handleLike = (id, likes) => {
        setPopular(prev => prev.map(n => n._id === id ? { ...n, likes } : n))
        setRecent(prev => prev.map(n => n._id === id ? { ...n, likes } : n))
    }

    const handleSave = (id, saves) => {
        setPopular(prev => prev.map(n => n._id === id ? { ...n, saves } : n))
        setRecent(prev => prev.map(n => n._id === id ? { ...n, saves } : n))
    }

    const notes = tab === 'popular' ? popular : recent

    return (
        <div className={styles.page}>
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>📚 NoteNest</h1>
                <p className={styles.heroSub}>Discover, share, and save study notes</p>
                <Link to="/search" className={styles.heroBtn}>Browse Notes</Link>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${tab === 'popular' ? styles.active : ''}`}
                    onClick={() => setTab('popular')}
                >
                    🔥 Popular
                </button>
                <button
                    className={`${styles.tab} ${tab === 'recent' ? styles.active : ''}`}
                    onClick={() => setTab('recent')}
                >
                    🕐 Recent
                </button>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading notes...</div>
            ) : notes.length === 0 ? (
                <div className={styles.empty}>No notes found.</div>
            ) : (
                <div className={styles.grid}>
                    {notes.map(note => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            onLike={handleLike}
                            onSave={handleSave}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default HomePage