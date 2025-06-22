// import React from 'react';

// export default function EducationStep({ data, onUpdate }) {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onUpdate({ [name]: value });
//   };

//   return (
//     <div>
//       <h3>Education</h3>
//       <form>
//         <div>
//           <label>Institute Name:</label>
//           <input
//             type="text"
//             name="institution"
//             value={data.institution || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>Credentials:</label>
//           <input
//             type="text"
//             name="credentials"
//             value={data.credentials || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>Start Date:</label>
//           <input
//             type="month"
//             name="startDate"
//             value={data.startDate || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>End Date:</label>
//           <input
//             type="month"
//             name="endDate"
//             value={data.endDate || ''}
//             onChange={handleChange}
//           />
//         </div>
//       </form>
//     </div>
//   );
// }
import React from 'react';

export default function EducationStep({ data = [], onUpdate }) {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
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
            value={edu.startDate}
            onChange={(e) => handleChange(index, 'startDate', e.target.value)}
          />
          <input
            type="month"
            placeholder="End Date"
            value={edu.endDate}
            onChange={(e) => handleChange(index, 'endDate', e.target.value)}
          />
          <button onClick={() => removeEducation(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addEducation}>+ Add Education</button>
    </div>
  );
}
