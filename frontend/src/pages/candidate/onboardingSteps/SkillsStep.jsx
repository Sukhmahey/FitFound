// import React, { useState } from 'react';

// export default function SkillsStep({ data = [], onUpdate }) {
//   const [newSkill, setNewSkill] = useState('');

//   const addSkill = () => {
//     if (newSkill.trim() && !data.includes(newSkill.trim())) {
//       const updated = [...data, newSkill.trim()];
//       onUpdate(updated);
//       setNewSkill('');
//     }
//   };

//   const removeSkill = (skillToRemove) => {
//     const updated = data.filter(skill => skill !== skillToRemove);
//     onUpdate(updated);
//   };

//   return (
//     <div>
//       <h3>Your Skills</h3>
//       <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//         <input
//           type="text"
//           value={newSkill}
//           placeholder="Enter a skill"
//           onChange={(e) => setNewSkill(e.target.value)}
//         />
//         <button type="button" onClick={addSkill}>Add</button>
//       </div>

//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//         {data.map((skill, index) => (
//           <div
//             key={index}
//             style={{
//               background: '#e0e0e0',
//               padding: '8px 12px',
//               borderRadius: '20px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}
//           >
//             {skill}
//             <button
//               style={{
//                 background: 'transparent',
//                 border: 'none',
//                 cursor: 'pointer',
//                 fontWeight: 'bold'
//               }}
//               onClick={() => removeSkill(skill)}
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';

export default function SkillsStep({ data = [], onUpdate }) {
  const [skill, setSkill] = useState('');

  const addSkill = () => {
    if (skill.trim()) {
      onUpdate([...data, { skill: skill.trim() }]);
      setSkill('');
    }
  };

  const removeSkill = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  return (
    <div>
      <h3>Skills</h3>
      <div>
        <input
          type="text"
          placeholder="Enter a skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <button onClick={addSkill}>Add</button>
      </div>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.skill}
            <button onClick={() => removeSkill(index)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

