import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginApi, logoutApi, refreshApi } from '../api/authApi'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)

    // On app load — restore session from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('accessToken')
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser))
            setAccessToken(storedToken)
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await loginApi({ email, password })
        if (res.accessToken) {
            setUser(res.user)
            setAccessToken(res.accessToken)
            localStorage.setItem('user', JSON.stringify(res.user))
            localStorage.setItem('accessToken', res.accessToken)
            localStorage.setItem('refreshToken', res.refreshToken)
        }
        return res
    }

    const logout = async () => {
        await logoutApi(accessToken)
        setUser(null)
        setAccessToken(null)
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }

    // Auto refresh access token using refresh token
    const refreshAccessToken = useCallback(async () => {
        const storedRefresh = localStorage.getItem('refreshToken')
        if (!storedRefresh) return null
        const res = await refreshApi(storedRefresh)
        if (res.accessToken) {
            setAccessToken(res.accessToken)
            localStorage.setItem('accessToken', res.accessToken)
            localStorage.setItem('refreshToken', res.refreshToken)
            return res.accessToken
        }
        return null
    }, [])

    return (
        <AuthContext.Provider value={{ user, accessToken, loading, login, logout, refreshAccessToken, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)