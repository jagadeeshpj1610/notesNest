import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { verifyOTPApi } from '../api/authApi'
import styles from './AuthPages.module.css'

const VerifyOTPPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ''
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const res = await verifyOTPApi({ email, otp })
        if (res.message === 'Email verified successfully') {
            navigate('/login')
        } else {
            setError(res.message || 'OTP verification failed')
        }
        setLoading(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.heading}>Verify Email 📧</h2>
                <p className={styles.sub}>Enter the OTP sent to <strong>{email}</strong></p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button className={styles.btn} type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default VerifyOTPPage