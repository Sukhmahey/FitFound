import React, { useState } from "react";
import { Box, TextField, Button, Chip, Stack } from "@mui/material";

export default function SkillsStep({ data = [], onUpdate, errors = {} ,editMode}) {
  const [skill, setSkill] = useState("");
  console.log(data[1]);

  const addSkill = () => {
    if (skill.trim()) {
      onUpdate([...data, { skill: skill.trim() }]);
      setSkill("");
    }
  };

  const removeSkill = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  return (
    <div className="d-flex justify-content-center w-80 flex-column mx-auto">
      <div className="d-flex flex-column w-50 mx-auto gap-3">
        <Box className="d-flex gap-2 align-items-center">
          <TextField
            label="Enter a skill"
            variant="outlined"
            disabled={!editMode}
            fullWidth
            value={skill}
            error={!!errors.skills}
            helperText={errors.skills}
            onChange={(e) => setSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button variant="contained" disabled={!editMode} color="primary" onClick={addSkill}>
            Add
          </Button>
        </Box>

        <Stack direction="row" useFlexGap spacing={1} flexWrap="wrap">
          {data.map((item, index) => (
            <Chip
              key={index}
              disabled={!editMode}
              label={item.skill || item}
              onDelete={() => removeSkill(index)}
              color="primary"
              sx={{ marginBottom: 1 , background:"#0E3A62"}}
            />
          ))}
        </Stack>
      </div>
    </div>
  );
}
