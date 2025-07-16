// PersonalInfoStep.jsx
import React from "react";
import { Box, TextField, Typography, Button } from "@mui/material";

export default function PersonalInfoStep({
  data,
  onUpdate,
  userEmail,
  errors = {},
  onNext,
  onBack,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* <Typography
          variant="h5"
          fontWeight={600}
          color="#0E3A62"
          align="center"
        >
          Personal Information
        </Typography> */}

        <TextField
          label="First Name"
          name="firstName"
          value={data.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          fullWidth
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={data.middleName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={data.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={userEmail || data.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Current Status"
          name="currentStatus"
          value={data.currentStatus}
          onChange={handleChange}
          placeholder="Student,Full-time"
          fullWidth
        />
        <TextField
          label="Specialization"
          name="specialization"
          value={data.specialization}
          onChange={handleChange}
          fullWidth
        />
      </Box>
    </Box>
  );
}
