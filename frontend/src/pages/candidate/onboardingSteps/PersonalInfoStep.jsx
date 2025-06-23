

import React from 'react';

export default function PersonalInfoStep({ data, onUpdate }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div>
      <h3>Personal Information</h3>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={data.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="middleName"
        placeholder="Middle Name"
        value={data.middleName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={data.lastName}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={data.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="currentStatus"
        placeholder="Current Status"
        value={data.currentStatus}
        onChange={handleChange}
      />
      <input
        type="text"
        name="specialization"
        placeholder="Specialization"
        value={data.specialization}
        onChange={handleChange}
      />
    </div>
  );
}
