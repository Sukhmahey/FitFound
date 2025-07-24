import React from "react";
import { Box, TextField, Button } from "@mui/material";

export default function EducationStep({ data = [], onUpdate, errors = {},editMode=true }) {
  const handleChange = (index, field, value) => {
    const updated = [...data];

    if (field === "startDate" || field === "endDate") {
      const [year, month] = value.split("-");
      updated[index][field] = `${month}-${year}`;
    } else {
      updated[index][field] = value;
    }

    onUpdate(updated);
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return "";
    const [month, year] = dateStr.split("-");
    return `${year}-${month}`;
  };

  const addEducation = () => {
    onUpdate([
      ...data,
      {
        instituteName: "",
        credentials: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    onUpdate(updated);
  };
  return (
    <div className="d-flex justify-content-center w-80 flex-column mx-auto">
      <div className="d-flex flex-column w-75 mx-auto gap-4">
        {data.map((edu, index) => (
          <Box
            component="form"
            key={index}
            sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Institute Name"
              id="outlined-basic"
              disabled={!editMode}
              variant="outlined"
              value={edu.instituteName}
              onChange={(e) =>
                handleChange(index, "instituteName", e.target.value)
              }
            />
            <TextField
              label="Credentials"
              variant="outlined"
              disabled={!editMode}
              value={edu.credentials}
              onChange={(e) =>
                handleChange(index, "credentials", e.target.value)
              }
            />

            <TextField
              type="month"
              label="Start Date"
              disabled={!editMode}
              InputLabelProps={{ shrink: true }}
              value={normalizeDate(edu.startDate) || ""}
              onChange={(e) => handleChange(index, "startDate", e.target.value)}
            />

            <TextField
              type="month"
              label="End Date"
              disabled={!editMode}
              InputLabelProps={{ shrink: true }}
              value={normalizeDate(edu.endDate) || ""}
              onChange={(e) => handleChange(index, "endDate", e.target.value)}
            />
            <Button
              variant="outlined"
              color="error"
              disabled={!editMode}
              onClick={() => removeEducation(index)}
            >
              Remove
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" disabled={!editMode} onClick={addEducation}>
          + Add Education
        </Button>
      </div>
    </div>
  );
}
