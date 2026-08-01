import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import api from '../services/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/token/', {
        username,
        password,
      })

      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)

      navigate('/home')
      setError(null)
    } catch (error) {
      if (error?.response?.data?.detail) {
        setError(error.response.data.detail)
      } else {
        setError('Something went wrong, please try again!')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h1>Login Form</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{loading ? 'Logging in..' : 'Login'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}
