// import React from 'react';

// export default function PortfolioStep({ data, onUpdate }) {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onUpdate({ [name]: value });
//   };

//   return (
//     <div>
//       <h3>Portfolio</h3>
//       <form>
//         <div>
//           <label>LinkedIn:</label>
//           <input
//             type="text"
//             name="linkedin"
//             value={data.linkedin || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>Personal Portfolio Website:</label>
//           <input
//             type="text"
//             name="website"
//             value={data.website || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>Additional Links:</label>
//           <input
//             type="text"
//             name="additional"
//             value={data.additional || ''}
//             onChange={handleChange}
//           />
//         </div>
//       </form>
//     </div>
//   );
// }

import React from 'react';

export default function PortfolioStep({ data = { socialLinks: {} }, onUpdate }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        [name]: value
      }
    });
  };

  const handleLinkChange = (index, value) => {
    const updated = [...(data.socialLinks.additionalLinks || [])];
    updated[index] = value;
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        additionalLinks: updated
      }
    });
  };

  const addLink = () => {
    const updated = [...(data.socialLinks.additionalLinks || []), ''];
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        additionalLinks: updated
      }
    });
  };

  const removeLink = (index) => {
    const updated = [...(data.socialLinks.additionalLinks || [])];
    updated.splice(index, 1);
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        additionalLinks: updated
      }
    });
  };

  return (
    <div>
      <h3>Portfolio Links</h3>
      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn URL"
        value={data.socialLinks?.linkedin || ''}
        onChange={handleChange}
      />
      <input
        type="text"
        name="personalPortfolioWebsite"
        placeholder="Personal Website"
        value={data.socialLinks?.personalPortfolioWebsite || ''}
        onChange={handleChange}
      />

      <h4>Additional Links</h4>
      {(data.socialLinks?.additionalLinks || []).map((link, index) => (
        <div key={index}>
          <input
            type="text"
            value={link}
            onChange={(e) => handleLinkChange(index, e.target.value)}
          />
          <button onClick={() => removeLink(index)}>x</button>
        </div>
      ))}
      <button onClick={addLink}>+ Add Link</button>
    </div>
  );
}
