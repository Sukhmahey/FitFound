// import React from 'react';

// export default function BasicInfoStep({ data, onUpdate }) {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onUpdate({ [name]: value });
//   };

//   return (
//     <div>
//       <h3>Basic Information</h3>
//       <form>
//         <div>
//           <label>Phone Number:</label>
//           <input
//             type="text"
//             name="phoneNumber"
//             value={data.phoneNumber || ''}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Work Status:</label>
//           <input
//             type="text"
//             name="workStatus"
//             value={data.workStatus || ''}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Language:</label>
//           <input
//             type="text"
//             name="languages"
//             value={data.languages || ''}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Bio:</label>
//           <textarea
//             name="bio"
//             value={data.bio || ''}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Additional Info:</label>
//           <input
//             type="text"
//             name="additionalInfo"
//             value={data.additionalInfo || ''}
//             onChange={handleChange}
//           />
//         </div>
//       </form>
//     </div>
//   );
// }

import React from 'react';

export default function BasicInfoStep({ data, onUpdate }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div>
      <h3>Basic Information</h3>
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={data.phoneNumber}
        onChange={handleChange}
      />
      <input
        type="text"
        name="workStatus"
        placeholder="Work Status"
        value={data.workStatus}
        onChange={handleChange}
      />
      <input
        type="text"
        name="language"
        placeholder="Language"
        value={data.language}
        onChange={handleChange}
      />
      <textarea
        name="bio"
        placeholder="Short Bio"
        value={data.bio}
        onChange={handleChange}
      />
      <textarea
        name="additionalInfo"
        placeholder="Additional Info"
        value={data.additionalInfo}
        onChange={handleChange}
      />
    </div>
  );
}
