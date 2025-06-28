

import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


export default function PersonalInfoStep({ data, onUpdate , userEmail}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div className='d-flex justify-content-center w-80 flex-column mx-auto'>
      
      <h3 className='h3'>Personal Information</h3>
  <div className="d-flex flex-column w-50 mx-auto gap-3 ">
    
          <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        ></Box>
          <TextField
            type="text"
            name="firstName"
            id="outlined-basic" label="First Name" variant="outlined"
            value={data.firstName}
            onChange={handleChange}
          />
          <TextField
            type="text"
            name="middleName"
            id="outlined-basic" label="Middle Name" variant="outlined"
            value={data.middleName}
            onChange={handleChange}
          />
          <TextField
            type="text"
            name="lastName"
            id="outlined-basic" label="Last Name" variant="outlined"
            value={data.lastName}
            onChange={handleChange}
          />
          <TextField
            type="email"
            name="email"
            id="outlined-basic" label="Email" variant="outlined"
            value={userEmail || data.email}
            onChange={handleChange}
          />
          <TextField
            type="text"
            name="currentStatus"
            id="outlined-basic" label="Current Status" variant="outlined"
            value={data.currentStatus}
            onChange={handleChange}
          />
          <TextField
            type="text"
            name="specialization"
            id="outlined-basic" label="Specialization" variant="outlined"
            value={data.specialization}
            onChange={handleChange}
          />
  </div>
    </div>
  );
}
