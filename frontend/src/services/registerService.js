import api from './api'

export default function registerUser({ username, email, password }) {
  const response = api.post('/register/', {
    username,
    email,
    password,
  })
}
