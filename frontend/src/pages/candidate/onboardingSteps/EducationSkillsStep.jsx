import React from 'react'

export default function EducationSkillsStep({data, onUpdate}) {

    const handleChange = (e)=>{
        const {name,value} = e.target;
        onUpdate({[name]:value})
    }

  return (
    <div>
      <h3>Education and Skills</h3>
      <form>
        <div>
          <label>Highest Degree:</label>
          <input
            type="text"
            name="degree"
            value={data.degree || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Field of Study:</label>
          <input
            type="text"
            name="field"
            value={data.field || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Institution:</label>
          <input
            type="text"
            name="institution"
            value={data.institution || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Graduation Year:</label>
          <input
            type="number"
            name="gradYear"
            value={data.gradYear || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Key Skills (comma separated):</label>
          <input
            type="text"
            name="skills"
            value={data.skills || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Certifications (optional, comma separated):</label>
          <input
            type="text"
            name="certifications"
            value={data.certifications || ''}
            onChange={handleChange}
          />
        </div>
      </form>
      </div>

  )
}
