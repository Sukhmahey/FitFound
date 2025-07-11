import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function BasicInfoStep({ data, onUpdate ,errors = {}}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div className='d-flex justify-content-center w-80 flex-column mx-auto'>

      <h3>Basic Information</h3>
      <div className="d-flex flex-column w-50 mx-auto gap-3 ">
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          ></Box>
        <TextField
          type="text"
          name="phoneNumber"
          id="outlined-basic" label="Phone Number" variant="outlined"
          value={data.phoneNumber}
          onChange={handleChange}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
        <TextField
          type="text"
          name="workStatus"
          id="outlined-basic" label="Work Status" variant="outlined"
          value={data.workStatus}
          onChange={handleChange}
        />
        <TextField
          type="text"
          name="language"
          id="outlined-basic" label="Language" variant="outlined"
          value={data.language}
          onChange={handleChange}
        />
        <TextField
          name="bio"
          id="outlined-multiline-static"
            label="Short Bio"
            multiline
            rows={4}
          value={data.bio}
          onChange={handleChange}
        />
        {/* <TextField
          name="additionalInfo"
          id="outlined-multiline-static"
            label="Additional Info"
            multiline
            rows={4}
          value={data.additionalInfo}
          onChange={handleChange}
        /> */}
      </div>
    </div>
  );
}
