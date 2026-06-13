import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        NotesNest
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/notes">Notes</Link>
        <Link to="/admin/login">Admin</Link>
      </nav>
    </header>
  )
}

export default Navbar