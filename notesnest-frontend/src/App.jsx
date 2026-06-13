import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/HomePage'
import NotesPage from './pages/NotesPage'
import NoteDetailsPage from './pages/NoteDetailsPage'
// import AdminLoginPage from './pages/AdminLoginPage'
// import AdminUploadPage from './pages/AdminUploadPage'
// import AdminManageNotesPage from './pages/AdminManageNotesPage'

function App() {
  return (
    <>
      <Navbar />

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/:id" element={<NoteDetailsPage />} />

          {/* <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute>
                <AdminUploadPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/notes"
            element={
              <ProtectedRoute>
                <AdminManageNotesPage />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App