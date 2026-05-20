const BASE_URL = 'http://localhost:8000/api/notes'

export const searchNotesApi = async (q) => {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`)
    return res.json()
}

export const filterBySubjectApi = async (subject) => {
    const res = await fetch(`${BASE_URL}/filter?subject=${encodeURIComponent(subject)}`)
    return res.json()
}

export const getPopularNotesApi = async () => {
    const res = await fetch(`${BASE_URL}/popular`)
    return res.json()
}

export const getRecentNotesApi = async () => {
    const res = await fetch(`${BASE_URL}/recent`)
    return res.json()
}