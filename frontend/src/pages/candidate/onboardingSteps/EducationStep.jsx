import React from 'react';

export default function EducationStep({ data = [], onUpdate }) {
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

  const addEducation = () => {
    onUpdate([
      ...data,
      {
        instituteName: '',
        credentials: '',
        startDate: '',
        endDate: ''
      }
    ]);
  };

  const removeEducation = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  return (
    <div>
      <h3>Education</h3>
      {data.map((edu, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Institute Name"
            value={edu.instituteName}
            onChange={(e) => handleChange(index, 'instituteName', e.target.value)}
          />
          <input
            type="text"
            placeholder="Credentials"
            value={edu.credentials}
            onChange={(e) => handleChange(index, 'credentials', e.target.value)}
          />
          <input
            type="month"
            placeholder="Start Date"
            value={edu.startDate ? `${edu.startDate.split('-')[1]}-${edu.startDate.split('-')[0]}` : ''}
            onChange={(e) => handleChange(index, 'startDate', e.target.value)}
          />
          <input
            type="month"
            placeholder="End Date"
            value={edu.endDate ? `${edu.endDate.split('-')[1]}-${edu.endDate.split('-')[0]}` : ''}
            onChange={(e) => handleChange(index, 'endDate', e.target.value)}
          />
          <button onClick={() => removeEducation(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addEducation}>+ Add Education</button>
    </div>
  );
}
