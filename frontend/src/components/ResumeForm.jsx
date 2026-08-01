import { useState, useRef } from 'react'
import { analyzeResume } from '../services/analyzeResumeService'
import api from '../services/api'
import Result from './Result'

export default function ResumeForm() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setResumeFile(null)
    setJobDescription('')
    setError(null)

    if (!resumeFile) {
      setError('Please upload a resume.')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description.')
      return
    }
    setLoading(true)
    try {
      const response = await analyzeResume(resumeFile, jobDescription)
      setResult(response)
      fileInputRef.current.value = ''
    } catch (error) {
      if (error?.response?.data?.detail) {
        setError(error.response.data.detail)
      } else {
        setError('Something went wrong, please try again')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Resume Form</h1>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
          ref={fileInputRef}
        />
        {resumeFile && <p>Uploaded : {resumeFile.name}</p>}
        <input
          type="text"
          placeholder="job description"
          onChange={(e) => setJobDescription(e.target.value)}
          value={jobDescription}
          rows="10"
          columns="60"
        />
        {loading ? (
          'Analyzing Resume...'
        ) : (
          <button type="submit" disabled={loading}>
            Analyze
          </button>
        )}
      </form>
      {setError && <p style={{ color: 'red' }}>{error}</p>}
      <Result result={result} />
    </div>
  )
}
