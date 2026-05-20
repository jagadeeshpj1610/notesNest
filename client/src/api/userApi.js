const BASE_URL = 'http://localhost:8000/api/users'

const authHeader = (token) => ({
    Authorization: `Bearer ${token}`,
})

export const getMyProfileApi = async (token) => {
    const res = await fetch(`${BASE_URL}/me`, {
        headers: authHeader(token),
    })
    return res.json()
}

export const updateProfileApi = async (data, token) => {
    const res = await fetch(`${BASE_URL}/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader(token),
        },
        body: JSON.stringify(data),
    })
    return res.json()
}

export const uploadAvatarApi = async (formData, token) => {
    const res = await fetch(`${BASE_URL}/me/avatar`, {
        method: 'PUT',
        headers: authHeader(token),
        body: formData, // FormData — no Content-Type
    })
    return res.json()
}

export const getUserByIdApi = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`)
    return res.json()
}

export const getMyNotesApi = async (token) => {
    const res = await fetch(`${BASE_URL}/me/notes`, {
        headers: authHeader(token),
    })
    return res.json()
}

export const getMySavedNotesApi = async (token) => {
    const res = await fetch(`${BASE_URL}/me/saved`, {
        headers: authHeader(token),
    })
    return res.json()
}