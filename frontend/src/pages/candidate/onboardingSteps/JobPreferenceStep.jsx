import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Chip,
  Checkbox,
  FormControlLabel
} from '@mui/material';

export default function JobPreferenceStep({ data, onUpdate }) {
  const [title, setTitle] = useState('');

  const addTitle = () => {
    if (title.trim()) {
      onUpdate({
        ...data,
        desiredJobTitle: [...(data.desiredJobTitle || []), title.trim()]
      });
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
    <div className="d-flex justify-content-center w-80 flex-column mx-auto">
      <h4>Job Preferences</h4>
      <div className="d-flex flex-column w-75 mx-auto gap-4">

        {/* Desired Job Titles Input */}
        <Box className="d-flex gap-2 align-items-center">
          <TextField
            label="Enter Desired Job Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTitle();
              }
            }}
          />
          <Button variant="contained" color="primary" onClick={addTitle}>
            Add
          </Button>
        </Box>

        {/* Display Added Job Titles */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {(data.desiredJobTitle || []).map((t, index) => (
            <Chip
              key={index}
              label={t}
              onDelete={() => removeTitle(index)}
              color="primary"
              sx={{ marginBottom: 1 }}
            />
          ))}
        </Stack>

        {/* Job Type Selection */}
        <FormControl fullWidth>
          <InputLabel id="job-type-label">Job Type</InputLabel>
          <Select
            labelId="job-type-label"
            name="jobType"
            value={data.jobType}
            label="Job Type"
            onChange={handleChange}
          >
            <MenuItem value="">Select Job Type</MenuItem>
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="full-time">Full-time</MenuItem>
            <MenuItem value="part-time">Part-time</MenuItem>
            <MenuItem value="contract">Contract</MenuItem>
            <MenuItem value="internship">Internship</MenuItem>
            <MenuItem value="on-site">On-site</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
          </Select>
        </FormControl>

        {/* Salary Expectation */}
        <Box className="d-flex flex-column gap-2">
          <h6>Salary Expectation</h6>
          <TextField
            type="number"
            name="min"
            label="Minimum Salary"
            value={data.salaryExpectation?.min || ''}
            onChange={handleChange}
            InputProps={{ startAdornment: <span>$</span> }}
          />
          <Box className="d-flex gap-4">
            <FormControlLabel
              control={
                <Checkbox
                  name="perHour"
                  checked={data.salaryExpectation?.perHour || false}
                  onChange={handleChange}
                />
              }
              label="Per Hour"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="perYear"
                  checked={data.salaryExpectation?.perYear || false}
                  onChange={handleChange}
                />
              }
              label="Per Year"
            />
          </Box>
        </Box>
      </div>
    </div>
  );
}
