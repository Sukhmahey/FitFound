// import React, { useState } from 'react';

// export default function JobPreferenceStep({ data, onUpdate }) {
//   const [titleInput, setTitleInput] = useState('');
//   const [titles, setTitles] = useState(data.desiredTitles || []);

//   const addTitle = () => {
//     const trimmed = titleInput.trim();
//     if (trimmed && !titles.includes(trimmed)) {
//       const updated = [...titles, trimmed];
//       setTitles(updated);
//       onUpdate({ ...data, desiredTitles: updated });
//       setTitleInput('');
//     }
//   };

//   const removeTitle = (titleToRemove) => {
//     const updated = titles.filter(title => title !== titleToRemove);
//     setTitles(updated);
//     onUpdate({ ...data, desiredTitles: updated });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onUpdate({ ...data, [name]: value });
//   };

//   return (
//     <div>
//       <h3>Job Preferences</h3>

//       <div>
//         <label>Desired Job Titles:</label>
//         <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//           <input
//             type="text"
//             value={titleInput}
//             onChange={(e) => setTitleInput(e.target.value)}
//             placeholder="e.g., Frontend Developer"
//           />
//           <button type="button" onClick={addTitle}>Add</button>
//         </div>
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//           {titles.map((title, index) => (
//             <div
//               key={index}
//               style={{
//                 background: '#d8d8d8',
//                 padding: '6px 12px',
//                 borderRadius: '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px'
//               }}
//             >
//               {title}
//               <button
//                 style={{
//                   background: 'transparent',
//                   border: 'none',
//                   fontWeight: 'bold',
//                   cursor: 'pointer'
//                 }}
//                 onClick={() => removeTitle(title)}
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ marginTop: '16px' }}>
//         <label>Job Type:</label>
//         <select
//           name="jobType"
//           value={data.jobType || ''}
//           onChange={handleChange}
//         >
//           <option value="">Select</option>
//           <option value="Remote">Remote</option>
//           <option value="On-site">On-site</option>
//           <option value="Hybrid">Hybrid</option>
//           <option value="Freelance">Freelance</option>
//         </select>
//       </div>

//       <div style={{ marginTop: '16px' }}>
//         <label>Salary Expectation (per year):</label>
//         <input
//           type="number"
//           name="salaryExpectation"
//           value={data.salaryExpectation || ''}
//           onChange={handleChange}
//           placeholder="e.g. 60000"
//         />
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';

export default function JobPreferenceStep({ data, onUpdate }) {
  const [title, setTitle] = useState('');

  const addTitle = () => {
    if (title.trim()) {
      onUpdate({ ...data, desiredJobTitle: [...(data.desiredJobTitle || []), title.trim()] });
      setTitle('');
    }
  };

  const removeTitle = (index) => {
    const updated = [...(data.desiredJobTitle || [])];
    updated.splice(index, 1);
    onUpdate({ ...data, desiredJobTitle: updated });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'perHour' || name === 'perYear') {
      onUpdate({
        ...data,
        salaryExpectation: {
          ...data.salaryExpectation,
          [name]: checked
        }
      });
    } else if (name === 'min') {
      onUpdate({
        ...data,
        salaryExpectation: {
          ...data.salaryExpectation,
          min: Number(value)
        }
      });
    } else {
      onUpdate({ ...data, [name]: value });
    }
  };

  return (
    <div>
      <h3>Job Preferences</h3>
      <div>
        <input
          type="text"
          placeholder="Enter Desired Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTitle}>Add</button>
        <ul>
          {(data.desiredJobTitle || []).map((t, index) => (
            <li key={index}>
              {t} <button onClick={() => removeTitle(index)}>x</button>
            </li>
          ))}
        </ul>
      </div>

      <select name="jobType" value={data.jobType} onChange={handleChange}>
        <option value="">Select Job Type</option>
        <option value="Remote">Remote</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
        <option value="internship">Internship</option>
        <option value="on-site">On-site</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <div>
        <label>
          Salary Expectation: $
          <input
            type="number"
            name="min"
            value={data.salaryExpectation?.min || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <input
            type="checkbox"
            name="perHour"
            checked={data.salaryExpectation?.perHour || false}
            onChange={handleChange}
          /> Per Hour
        </label>
        <label>
          <input
            type="checkbox"
            name="perYear"
            checked={data.salaryExpectation?.perYear || false}
            onChange={handleChange}
          /> Per Year
        </label>
      </div>
    </div>
  );
}
