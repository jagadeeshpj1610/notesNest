import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { forgotPasswordApi } from '../api/authApi'
import styles from './AuthPages.module.css'

const ForgotPasswordPage = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const res = await forgotPasswordApi(email)
        if (res.message === 'OTP sent to your email') {
            setSuccess('OTP sent! Check your email.')
            setTimeout(() => navigate('/reset-password', { state: { email } }), 1500)
        } else {
            setError(res.message || 'Something went wrong')
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.heading}>Forgot Password 🔑</h2>
                <p className={styles.sub}>Enter your email to receive an OTP</p>

                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className={styles.btn} type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>

                <p className={styles.footer}>
                    <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    )
}

export default ForgotPasswordPage