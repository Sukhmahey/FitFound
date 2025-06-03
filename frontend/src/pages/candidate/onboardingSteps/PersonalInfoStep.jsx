import React from 'react';


export default function PersonalInfoStep({ data, onUpdate }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div>
      <h3>Personal Information</h3>
      <form>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={data.name || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={data.email || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={data.phone || ''}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
}
