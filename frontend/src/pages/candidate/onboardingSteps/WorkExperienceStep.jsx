import React from 'react';

export default function WorkExperienceStep({ data = [], onUpdate }) {

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const addExperience = () => {
    onUpdate([
      ...data,
      {
        companyName: '',
        role: '',
        startDate: '',
        endDate: '',
        achievements: '',
        technologiesUsed: '',
        remarks: ''
      }
    ]);
  };

  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  return (
    <div>
      <h3>Work Experience</h3>
      {data.map((exp, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <div>
            <label>Company Name:</label>
            <input
              type="text"
              value={exp.companyName}
              onChange={(e) => handleChange(index, 'companyName', e.target.value)}
            />
          </div>

          <div>
            <label>Role:</label>
            <input
              type="text"
              value={exp.role}
              onChange={(e) => handleChange(index, 'role', e.target.value)}
            />
          </div>

          <div>
            <label>Start Date:</label>
            <input
              type="month"
              value={exp.startDate}
              onChange={(e) => handleChange(index, 'startDate', e.target.value)}
            />
          </div>

          <div>
            <label>End Date:</label>
            <input
              type="month"
              value={exp.endDate}
              onChange={(e) => handleChange(index, 'endDate', e.target.value)}
            />
          </div>

          <div>
            <label>Achievements:</label>
            <textarea
              value={exp.achievements}
              onChange={(e) => handleChange(index, 'achievements', e.target.value)}
            />
          </div>

          <div>
            <label>Technologies Used:</label>
            <input
              type="text"
              value={exp.technologiesUsed}
              onChange={(e) => handleChange(index, 'technologiesUsed', e.target.value)}
            />
          </div>

          <div>
            <label>Remarks:</label>
            <textarea
              value={exp.remarks}
              onChange={(e) => handleChange(index, 'remarks', e.target.value)}
            />
          </div>

          <button type="button" onClick={() => removeExperience(index)}>Remove</button>
        </div>
      ))}

      <button type="button" onClick={addExperience}>Add Work Experience</button>
    </div>
  );
}