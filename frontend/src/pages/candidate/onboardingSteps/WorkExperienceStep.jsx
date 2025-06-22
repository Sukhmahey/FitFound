// // import React from 'react';

// // export default function WorkExperienceStep({ data = [], onUpdate }) {

// //   const handleChange = (index, field, value) => {
// //     const updated = [...data];
// //     updated[index] = { ...updated[index], [field]: value };
// //     onUpdate(updated);
// //   };

// //   const addExperience = () => {
// //     onUpdate([
// //       ...data,
// //       {
// //         companyName: '',
// //         role: '',
// //         startDate: '',
// //         endDate: '',
// //         achievements: '',
// //         technologiesUsed: '',
// //         remarks: ''
// //       }
// //     ]);
// //   };

// //   const removeExperience = (index) => {
// //     const updated = data.filter((_, i) => i !== index);
// //     onUpdate(updated);
// //   };

// //   return (
// //     <div>
// //       <h3>Work Experience</h3>
// //       {data.map((exp, index) => (
// //         <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
// //           <div>
// //             <label>Company Name:</label>
// //             <input
// //               type="text"
// //               value={exp.companyName}
// //               onChange={(e) => handleChange(index, 'companyName', e.target.value)}
// //             />
// //           </div>

// //           <div>
// //             <label>Role:</label>
// //             <input
// //               type="text"
// //               value={exp.role}
// //               onChange={(e) => handleChange(index, 'role', e.target.value)}
// //             />
// //           </div>

// //           <div>
// //             <label>Start Date:</label>
// //             <input
// //               type="month"
// //               value={exp.startDate}
// //               onChange={(e) => handleChange(index, 'startDate', e.target.value)}
// //             />
// //           </div>

// //           <div>
// //             <label>End Date:</label>
// //             <input
// //               type="month"
// //               value={exp.endDate}
// //               onChange={(e) => handleChange(index, 'endDate', e.target.value)}
// //             />
// //           </div>

// //           <div>
// //             <label>Achievements:</label>
// //             <textarea
// //               value={exp.achievements}
// //               onChange={(e) => handleChange(index, 'achievements', e.target.value)}
// //             />
// //           </div>

// //           <div>
// //             <label>Technologies Used:</label>
// //             <input
// //               type="text"
// //               value={exp.technologiesUsed}
// //               onChange={(e) => handleChange(index, 'technologiesUsed', e.target.value)}
// //             />
// //           </div>

// //           <div>
// //             <label>Remarks:</label>
// //             <textarea
// //               value={exp.remarks}
// //               onChange={(e) => handleChange(index, 'remarks', e.target.value)}
// //             />
// //           </div>

// //           <button type="button" onClick={() => removeExperience(index)}>Remove</button>
// //         </div>
// //       ))}

// //       <button type="button" onClick={addExperience}>Add Work Experience</button>
// //     </div>
// //   );
// // }
// import React from 'react';

// export default function WorkExperienceStep({ data = [], onUpdate }) {
//   const handleChange = (index, field, value) => {
//     const updated = [...data];
//     updated[index] = { ...updated[index], [field]: value };
//     onUpdate(updated);
//   };

//   const addExperience = () => {
//     onUpdate([
//       ...data,
//       {
//         companyName: '',
//         jobTitle: '',
//         achievements: '',
//         startDate: '',
//         endDate: '',
//         role: '',
//         experienceLevel: '',
//         remarks: '',
//       }
//     ]);
//   };

//   const removeExperience = (index) => {
//     const updated = data.filter((_, i) => i !== index);
//     onUpdate(updated);
//   };

//   return (
//     <div>
//       <h3>Work Experience</h3>
//       {data.map((exp, index) => (
//         <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
//           <div>
//             <label>Company Name:</label>
//             <input
//               type="text"
//               value={exp.companyName}
//               onChange={(e) => handleChange(index, 'companyName', e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Job Title:</label>
//             <input
//               type="text"
//               value={exp.jobTitle}
//               onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Achievements:</label>
//             <textarea
//               value={exp.achievements}
//               onChange={(e) => handleChange(index, 'achievements', e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Start Date:</label>
//             <input
//               type="month"
//               value={exp.startDate}
//               onChange={(e) => handleChange(index, 'startDate', e.target.value)}
//             />
//           </div>

//           <div>
//             <label>End Date:</label>
//             <input
//               type="month"
//               value={exp.endDate}
//               onChange={(e) => handleChange(index, 'endDate', e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Role:</label>
//             <input
//               type="text"
//               value={exp.role}
//               onChange={(e) => handleChange(index, 'role', e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Experience Level:</label>
//             <input
//               type="text"
//               value={exp.experienceLevel}
//               onChange={(e) => handleChange(index, 'experienceLevel', e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Remarks from Employer:</label>
//             <textarea
//               value={exp.remarks}
//               onChange={(e) => handleChange(index, 'remarks', e.target.value)}
//             />
//           </div>

//           <button type="button" onClick={() => removeExperience(index)}>Remove</button>
//         </div>
//       ))}

//       <button type="button" onClick={addExperience}>Add Work Experience</button>
//     </div>
//   );
// }

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
          <input
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
