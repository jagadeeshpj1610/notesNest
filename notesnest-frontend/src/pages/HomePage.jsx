import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="page hero">
      <h1>Find Free Notes & Study Materials</h1>
      <p>
        NotesNest helps students find notes by branch, semester and subject.
      </p>

      <Link to="/notes" className="btn">
        Browse Notes
      </Link>
    </section>
  )
}

export default HomePage