import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import registerUser from '../services/registerService'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    setError('')

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await registerUser({
        username,
        email,
        password,
      })

      navigate('/')
    } catch (err) {
      setError('Registration failed.')
      console.error(err)
    }
  }

  return (
    <div>
      <h1>Register Form</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleRegister}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  )
}
