import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchNotesApi, filterBySubjectApi } from '../api/searchApi'
import NoteCard from '../components/NoteCard'
import styles from './SearchPage.module.css'

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Computer Science', 'Economics']

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(false)
    const [activeSubject, setActiveSubject] = useState('')

    useEffect(() => {
        const q = searchParams.get('q')
        if (q) {
            setQuery(q)
            doSearch(q)
        }
    }, [])

    const doSearch = async (q) => {
        setLoading(true)
        setActiveSubject('')
        const res = await searchNotesApi(q)
        setNotes(Array.isArray(res) ? res : [])
        setLoading(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (!query.trim()) return
        setSearchParams({ q: query })
        doSearch(query)
    }

    const handleSubject = async (subject) => {
        setActiveSubject(subject)
        setQuery('')
        setSearchParams({ subject })
        setLoading(true)
        const res = await filterBySubjectApi(subject)
        setNotes(Array.isArray(res) ? res : [])
        setLoading(false)
    }

    const handleLike = (id, likes) => setNotes(prev => prev.map(n => n._id === id ? { ...n, likes } : n))
    const handleSave = (id, saves) => setNotes(prev => prev.map(n => n._id === id ? { ...n, saves } : n))

    return (
        <div className={styles.page}>
            <h1 className={styles.heading}>Search Notes</h1>

            <form onSubmit={handleSearch} className={styles.searchBar}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Search by title, subject, tags..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button className={styles.btn} type="submit">Search</button>
            </form>

            <div className={styles.subjects}>
                {SUBJECTS.map(s => (
                    <button
                        key={s}
                        className={`${styles.subjectBtn} ${activeSubject === s ? styles.active : ''}`}
                        onClick={() => handleSubject(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className={styles.status}>Searching...</div>
            ) : notes.length === 0 && (searchParams.get('q') || searchParams.get('subject')) ? (
                <div className={styles.status}>No notes found.</div>
            ) : notes.length === 0 ? (
                <div className={styles.status}>Search for notes or pick a subject above.</div>
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

export default SearchPage