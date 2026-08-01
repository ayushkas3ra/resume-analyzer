import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { logout } from '../services/loginService'

export default function Logout() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleLogout = () => {
    setLoading(true)
    logout()
    navigate('/')
    setLoading(false)
  }

  return (
    <button onClick={handleLogout}>
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
