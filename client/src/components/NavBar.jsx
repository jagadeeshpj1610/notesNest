import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logo}>📚 NoteNest</Link>

            <div className={styles.links}>
                <Link to="/">Home</Link>
                <Link to="/search">Search</Link>

                {user ? (
                    <>
                        <Link to="/upload">Upload</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar