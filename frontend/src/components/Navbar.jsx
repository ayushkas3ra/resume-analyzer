import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
      <h2>Resume analyzer</h2>
      <div>
        <Link to="/">Home</Link>
        <Link>Logout</Link>
      </div>
    </nav>
  )
}
