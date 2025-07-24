import React from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";

function ProfileSetupOption({ onManualClick, onUploadClick }) {
  return (
    <Container sx={{ mt: 5 }}>
      <h2>Get Started</h2>
      <p>Choose how you want to set up your profile:</p>

      <div>
        <Button
          onClick={onManualClick}
          variant="contained"
          color="success"
          sx={{ mr: 2 }}
        >
          Fill Details Manually
        </Button>

        <Button onClick={onUploadClick} variant="contained" color="success">
          Upload Resume
        </Button>
      </div>
    </Container>
  );
}

export default ProfileSetupOption;
