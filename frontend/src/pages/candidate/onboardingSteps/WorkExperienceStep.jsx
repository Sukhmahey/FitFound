

import React from 'react';

export default function WorkExperienceStep({ data = [], onUpdate }) {
  // const handleChange = (index, field, value) => {
  //   const updated = [...data];
  //   updated[index] = { ...updated[index], [field]: value };
  //   onUpdate(updated);
  // };
  const handleChange = (index, field, value) => {
  const updated = [...data];

  if (field === 'startDate' || field === 'endDate') {
    const [year, month] = value.split('-');
    updated[index][field] = `${month}-${year}`;
  } else {
    updated[index][field] = value;
  }

  onUpdate(updated);
};


  const addExperience = () => {
    onUpdate([
      ...data,
      {
        companyName: '',
        jobTitle: '',
        achievements: [''],
        startDate: '',
        endDate: '',
        role: '',
        experienceLevel: '',
        remarkFromEmployer: ''
      }
    ]);
  };

  const removeExperience = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  const handleAchievementChange = (index, i, value) => {
    const updated = [...data];
    updated[index].achievements[i] = value;
    onUpdate(updated);
  };

  const addAchievement = (index) => {
    const updated = [...data];
    updated[index].achievements.push('');
    onUpdate(updated);
  };

  return (
    <div>
      <h3>Work History</h3>
      {data.map((exp, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Company Name"
            value={exp.companyName}
            onChange={(e) => handleChange(index, 'companyName', e.target.value)}
          />
          <input
            type="text"
            placeholder="Job Title"
            value={exp.jobTitle}
            onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
          />
          {/* <input
            type="month"
            placeholder="Start Date"
            value={exp.startDate}
            onChange={(e) => handleChange(index, 'startDate', e.target.value)}
          />
          <input
            type="month"
            placeholder="End Date"
            value={exp.endDate}
            onChange={(e) => handleChange(index, 'endDate', e.target.value)}
          /> */}
          <input
  type="month"
  value={
    exp.startDate
      ? `${exp.startDate.split('-')[1]}-${exp.startDate.split('-')[0]}`
      : ''
  }
  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
/>

<input
  type="month"
  value={
    exp.endDate
      ? `${exp.endDate.split('-')[1]}-${exp.endDate.split('-')[0]}`
      : ''
  }
  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
/>

          <input
            type="text"
            placeholder="Role"
            value={exp.role}
            onChange={(e) => handleChange(index, 'role', e.target.value)}
          />
          <select
            value={exp.experienceLevel}
            onChange={(e) => handleChange(index, 'experienceLevel', e.target.value)}
          >
            <option value="">Experience Level</option>
            <option value="junior">Junior</option>
            <option value="middle">Middle</option>
            <option value="senior">Senior</option>
          </select>
          <textarea
            placeholder="Remark From Employer"
            value={exp.remarkFromEmployer}
            onChange={(e) => handleChange(index, 'remarkFromEmployer', e.target.value)}
          />

          <div>
            <h4>Achievements</h4>
            {exp.achievements.map((a, i) => (
              <input
                key={i}
                type="text"
                value={a}
                placeholder={`Achievement ${i + 1}`}
                onChange={(e) => handleAchievementChange(index, i, e.target.value)}
              />
            ))}
            <button onClick={() => addAchievement(index)}>+ Add Achievement</button>
          </div>

          <button onClick={() => removeExperience(index)}>Remove Entry</button>
        </div>
      ))}
      <button onClick={addExperience}>+ Add Work Experience</button>
    </div>
  );
}
