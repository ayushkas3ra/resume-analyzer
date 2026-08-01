import axios from 'axios'
import api from './api'

export const analyzeResume = async (resumeFile, jobDescription) => {
  const formData = new FormData()

  formData.append('resume_file', resumeFile)
  formData.append('job_description', jobDescription)

  const response = await api.post('/analyze/', formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}
