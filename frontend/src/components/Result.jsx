export default function Result({ result }) {
  if (!result) return null

  const analysis = result.result

  return (
    <div>
      <h1>Analysis Result</h1>
      <p>Final Score: {analysis.final_score}</p>
      <p>Semantic Score: {analysis.semantic_score}</p>
      <p>Skill Score: {analysis.skill_score}</p>
      <p>Experience Score: {analysis.experience_score}</p>

      <h3>Matching Skills</h3>
      <ul>
        {analysis.matching_skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <h3>Missing Skills</h3>
      <ul>
        {analysis.missing_skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <h3>Strengths</h3>
      <ul>
        {analysis.feedback.strengths.map((item, index) => {
          <li key={index}>{item}</li>
        })}
      </ul>

      <h3>Weaknesses</h3>

      <ul>
        {analysis.feedback.weaknesses.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Skills To Learn</h3>

      <ul>
        {analysis.feedback.skills_to_learn.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Resume Improvements</h3>

      <ul>
        {analysis.feedback.resume_improvements.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
