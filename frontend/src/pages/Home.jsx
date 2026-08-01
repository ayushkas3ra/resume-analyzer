import ResumeForm from '../components/ResumeForm'
import Logout from '../components/Logout'

export default function Home() {
  return (
    <div>
      <Logout />
      <h1>Resume Analyzer</h1>
      <ResumeForm />
    </div>
  )
}
