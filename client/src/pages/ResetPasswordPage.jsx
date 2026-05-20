import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { resetPasswordApi } from '../api/authApi'
import styles from './AuthPages.module.css'

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ''
    const [form, setForm] = useState({ otp: '', newPassword: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const res = await resetPasswordApi({ email, ...form })
        if (res.message === 'Password reset successful') {
            navigate('/login')
        } else {
            setError(res.message || 'Reset failed')
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.heading}>Reset Password 🔒</h2>
                <p className={styles.sub}>Enter OTP and your new password</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={form.otp}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className={styles.input}
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <button className={styles.btn} type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordPage