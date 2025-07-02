import React from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack
} from '@mui/material';

export default function WorkExperienceStep({ data = [], onUpdate }) {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    onUpdate(updated);
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts[0].length === 4) return dateStr;
    return `${parts[1]}-${parts[0]}`;
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

  return (
    <div className="d-flex justify-content-center w-80 flex-column mx-auto">
      <h3>Work History</h3>
      <div className="d-flex flex-column w-75 mx-auto gap-4">
        {data.map((exp, index) => (
          <Box
            key={index}
            sx={{ border: '1px solid #ccc', borderRadius: 2, p: 3 }}
            className="d-flex flex-column gap-3"
          >
            <TextField
              label="Company Name"
              variant="outlined"
              value={exp.companyName}
              onChange={(e) => handleChange(index, 'companyName', e.target.value)}
            />
            <TextField
              label="Job Title"
              variant="outlined"
              value={exp.jobTitle}
              onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
            />
            {/* <TextField
              type="month"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={
                exp.startDate
                  ? `${exp.startDate.split('-')[1]}-${exp.startDate.split('-')[0]}`
                  : ''
              }
              onChange={(e) => handleChange(index, 'startDate', e.target.value)}
            />
            <TextField
              type="month"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={
                exp.endDate
                  ? `${exp.endDate.split('-')[1]}-${exp.endDate.split('-')[0]}`
                  : ''
              }
              onChange={(e) => handleChange(index, 'endDate', e.target.value)}
            /> */}
            <TextField
              type="month"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={normalizeDate(exp.startDate) || ''}

              onChange={(e) => handleChange(index, 'startDate', e.target.value)}
            />

            <TextField
              type="month"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={normalizeDate(exp.endDate) || ''}
              onChange={(e) => handleChange(index, 'endDate', e.target.value)}
            />
            <TextField
              label="Role"
              variant="outlined"
              value={exp.role}
              onChange={(e) => handleChange(index, 'role', e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id={`exp-level-label`}>Experience Level</InputLabel>
              <Select
                labelId={`exp-level-input`}
                value={exp.experienceLevel}
                label="Experience Level"
                onChange={(e) => handleChange(index, 'experienceLevel', e.target.value)}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="junior">Junior</MenuItem>
                <MenuItem value="middle">Middle</MenuItem>
                <MenuItem value="senior">Senior</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Remark From Employer"
              multiline
              rows={3}
              variant="outlined"
              value={exp.remarkFromEmployer}
              onChange={(e) => handleChange(index, 'remarkFromEmployer', e.target.value)}
            />

            <Box>
              <h6 className='text-decoration-underline'>Achievements</h6>
              <Stack spacing={2} mt={4}>
                {exp.achievements.map((a, i) => (
                  <TextField
                    key={i}
                    label={`Achievement ${i + 1}`}
                    variant="outlined"
                    value={a}
                    onChange={(e) => handleAchievementChange(index, i, e.target.value)}
                  />
                ))}
              </Stack>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => addAchievement(index)}
                sx={{ mt: 2 }}
              >
                + Add Achievement
              </Button>
            </Box>

            <Button
              variant="outlined"
              color="error"
              onClick={() => removeExperience(index)}
              sx={{ mt: 2 }}
            >
              Remove Entry
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={addExperience}>
          + Add Work Experience
        </Button>
      </div>
    </div>
  );
}
