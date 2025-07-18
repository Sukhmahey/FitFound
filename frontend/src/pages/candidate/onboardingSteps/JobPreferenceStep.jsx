import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Chip,
  Checkbox,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  TextField, Radio, RadioGroup
} from "@mui/material";

const predefinedJobTitles = [
  "frontend developer",
  "backend developer",
  "fullstack developer",
  "ux designer",
  "ui designer",
];

export default function JobPreferenceStep({ data, onUpdate, errors = {} }) {
  const [selectedRole, setSelectedRole] = useState(
    data.desiredJobTitle?.[0] || ""
  );

  const handleChange = (event, newRole) => {
    if (newRole) {
      setSelectedRole(newRole);
      onUpdate({
        ...data,
        desiredJobTitle: newRole,
      });
    }
  };

  const handleSalaryChange = (e) => {
    const { name, value, checked, type } = e.target;
    // if (name === "perHour" || name === "perYear") {
    //   onUpdate({
    //     ...data,
    //     salaryExpectation: {
    //       ...data.salaryExpectation,
    //       [name]: checked,
    //     },
    //   });
    // } 
    if (name === "salaryType") {
  onUpdate({
    ...data,
    salaryExpectation: {
      ...data.salaryExpectation,
      perHour: value === "perHour",
      perYear: value === "perYear",
    },
  });
}
    else if (name === "min") {
  const num = Number(value);
  onUpdate({
    ...data,
    salaryExpectation: {
      ...data.salaryExpectation,
      min: num < 0 ? 0 : num, 
    },
  });
}
 else {
      onUpdate({ ...data, [name]: value });
    }
  };

  return (
    <div className="d-flex justify-content-center w-80 flex-column mx-auto">
      <div className="d-flex flex-column w-75 mx-auto gap-4">
        <Typography variant="subtitle1">
          Select Your Preferred Job Role
        </Typography>
        <ToggleButtonGroup
          value={selectedRole}
          exclusive
          onChange={handleChange}
          fullWidth
          color="primary"
          error={!!errors.selectedRole}
          helperText={errors.selectedRole}
        >
          {predefinedJobTitles.map((role) => (
            <ToggleButton
              key={role}
              value={role}
              sx={{ textTransform: "capitalize" }}
            >
              {role}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Job Type Dropdown */}
        <FormControl fullWidth>
          <InputLabel id="job-type-label">Job Type</InputLabel>
          <Select
            labelId="job-type-label"
            name="jobType"
            value={data.jobType}
            label="Job Type"
            onChange={handleSalaryChange}
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
            value={data.salaryExpectation?.min || ""}
            onChange={handleSalaryChange}
            InputProps={{ startAdornment: <span>$</span> }}
            inputProps={{ min: 0 }}
          />
          <Box className="d-flex gap-4">
            {/* <FormControlLabel
              control={
                <Checkbox
                  name="perHour"
                  checked={data.salaryExpectation?.perHour || false}
                  onChange={handleSalaryChange}
                />
              }
              label="Per Hour"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="perYear"
                  checked={data.salaryExpectation?.perYear || false}
                  onChange={handleSalaryChange}
                />
              }
              label="Per Year"
            /> */}
            <FormControl component="fieldset">
  <RadioGroup
    row
    name="salaryType"
    value={
      data.salaryExpectation?.perHour
        ? "perHour"
        : data.salaryExpectation?.perYear
        ? "perYear"
        : ""
    }
    onChange={handleSalaryChange}
  >
    <FormControlLabel value="perHour" control={<Radio />} label="Per Hour" />
    <FormControlLabel value="perYear" control={<Radio />} label="Per Year" />
  </RadioGroup>
</FormControl>

          </Box>
        </Box>
      </div>
    </div>
  );
}
