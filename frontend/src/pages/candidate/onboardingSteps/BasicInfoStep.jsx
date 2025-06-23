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
