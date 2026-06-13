import { useParams } from 'react-router-dom'

function NoteDetailsPage() {
  const { id } = useParams()

  return (
    <section className="page">
      <h1>Note Details</h1>
      <p>Note ID: {id}</p>
    </section>
  )
}

export default NoteDetailsPage