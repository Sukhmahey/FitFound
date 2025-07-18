import React from "react";
import { Box, TextField, Button, Stack } from "@mui/material";

export default function PortfolioStep({
  data = { socialLinks: {} },
  onUpdate,
  errors = {},
  editMode
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        [name]: value,
      },
    });
  };

  const handleLinkChange = (index, value) => {
    const updated = [...(data.socialLinks.additionalLinks || [])];
    updated[index] = value;
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        additionalLinks: updated,
      },
    });
  };

  const addLink = () => {
    const updated = [...(data.socialLinks.additionalLinks || []), ""];
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        additionalLinks: updated,
      },
    });
  };

  const removeLink = (index) => {
    const updated = [...(data.socialLinks.additionalLinks || [])];
    updated.splice(index, 1);
    onUpdate({
      socialLinks: {
        ...data.socialLinks,
        additionalLinks: updated,
      },
    });
  };

  return (
    <div className="d-flex justify-content-center w-80 flex-column mx-auto">
      <div className="d-flex flex-column w-75 mx-auto gap-4">
        <TextField
          label="LinkedIn URL"
          name="linkedin"
          variant="outlined"
          value={data.socialLinks?.linkedin || ""} disabled={!editMode}
          onChange={handleChange}
        />
        <TextField
          label="Personal Website"
          name="personalPortfolioWebsite"
          variant="outlined"
          value={data.socialLinks?.personalPortfolioWebsite || ""} disabled={!editMode}
          onChange={handleChange}
        />

        <Box>
          <h4>Additional Links</h4>
          <Stack spacing={2}>
            {(data.socialLinks?.additionalLinks || []).map((link, index) => (
              <Box key={index} display="flex" gap={1} alignItems="center">
                <TextField
                  fullWidth
                  label={`Link ${index + 1}`}
                  variant="outlined"
                  value={link} disabled={!editMode}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeLink(index)} disabled={!editMode}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
          <Button variant="outlined" disabled={!editMode} onClick={addLink} sx={{ mt: 2 }}>
            + Add Link
          </Button>
        </Box>
      </div>
    </div>
  );
}
