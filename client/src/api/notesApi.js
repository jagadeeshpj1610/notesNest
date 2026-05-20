const BASE_URL = 'http://localhost:8000/api/notes'

const authHeader = (token) => ({
    Authorization: `Bearer ${token}`,
})

export const getAllNotesApi = async () => {
    const res = await fetch(`${BASE_URL}`)
    return res.json()
}

export const getSingleNoteApi = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`)
    return res.json()
}

export const uploadNoteApi = async (formData, token) => {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: authHeader(token),
        body: formData, // FormData — no Content-Type header, browser sets it
    })
    return res.json()
}

export const deleteNoteApi = async (id, token) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeader(token),
    })
    return res.json()
}

export const likeNoteApi = async (id, token) => {
    const res = await fetch(`${BASE_URL}/${id}/like`, {
        method: 'POST',
        headers: authHeader(token),
    })
    return res.json()
}

export const saveNoteApi = async (id, token) => {
    const res = await fetch(`${BASE_URL}/${id}/save`, {
        method: 'POST',
        headers: authHeader(token),
    })
    return res.json()
}

export const addCommentApi = async (id, comment, token) => {
    const res = await fetch(`${BASE_URL}/${id}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader(token),
        },
        body: JSON.stringify({ comment }),
    })
    return res.json()
}

export const downloadNoteApi = async (id, token) => {
    const res = await fetch(`${BASE_URL}/${id}/download`, {
        headers: authHeader(token),
    })
    return res.json()
}