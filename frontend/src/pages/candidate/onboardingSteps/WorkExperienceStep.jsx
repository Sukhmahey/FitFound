import React from 'react'

export default function WorkExperienceStep({ data, onUpdate }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate({ [name]: value });

    }

    return (
        <div>
      <h3>Work Experience</h3>
      <form>

        <div>
          <label>Are you eligible to work?</label>
          <div>
            <input
              type="radio"
              name="isEligibleToWork"
              value="yes"
              checked={data.isEligibleToWork === 'yes'}
              onChange={(e) => onUpdate({ isEligibleToWork: e.target.value })}
            />
            <label htmlFor="yes">Yes</label>

            <input
              type="radio"
              name="isEligibleToWork"
              value="no"
              checked={data.isEligibleToWork === 'no'}
              onChange={(e) => onUpdate({ isEligibleToWork: e.target.value })}
            />
            <label htmlFor="no">No</label>
          </div>
        </div>

        <div>
          <label>Experience Level:</label>
          <input
            type="text"
            name="experienceLevel"
            value={data.experienceLevel || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Work History:</label>
          <textarea
            name="workHistory"
            value={data.workHistory || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Preferred Role:</label>
          <input
            type="text"
            name="preferredRoles"
            value={data.preferredRoles || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Salary Expectation (Min):</label>
          <input
            type="number"
            name="salaryMin"
            value={data.salaryMin || ''}
            onChange={(e) => onUpdate({ salaryMin: Number(e.target.value) })}
          />
        </div>

        <div>
          <label>Salary Expectation (Max):</label>
          <input
            type="number"
            name="salaryMax"
            value={data.salaryMax || ''}
            onChange={(e) => onUpdate({ salaryMax: Number(e.target.value) })}
          />
        </div>
        
      </form>
    </div>

    )
}
