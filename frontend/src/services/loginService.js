import api from './api'

export async function login(username, password) {
  const response = await api.post('/token/', {
    username,
    password,
  })
    localStorage.setItem('access', response.access)
    localStorage.setItem('refresh', response.refresh)
  return response.data
}

export function logout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}
