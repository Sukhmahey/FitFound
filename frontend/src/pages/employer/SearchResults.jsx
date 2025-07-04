import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
  TextField,
  InputAdornment,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

// Utility to censor names (e.g., Vipul → V***l)
const censorName = (name) => {
  if (!name || name.length < 2) return name ?? "-";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
};

const CandidateCard = ({ data, onViewDetails, sendVerificationRequest }) => {
  const firstName = censorName(data?.personalInfo?.firstName ?? "");
  const lastName = censorName(data?.personalInfo?.lastName ?? "");
  const fullName = `${firstName} ${lastName}`;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "center",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "#FADADD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: "bold",
          mr: 3,
        }}
      >
        {data?.matchingScore ?? "-"}%
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">{fullName}</Typography>
        <Typography variant="body2">
          Specialization:{" "}
          <strong>{data?.personalInfo?.specialization ?? "-"}</strong>
        </Typography>
        <Typography variant="body2">
          Role: <strong>{data?.workHistory?.[0]?.role ?? "-"}</strong> •{" "}
          {data?.basicInfo?.workStatus ?? "-"}
        </Typography>
      </Box>

      <Stack spacing={1} alignItems="flex-end">
        <Typography variant="subtitle1" fontWeight="bold">
          ${data?.jobPreference?.salaryExpectation?.min ?? "-"} /hr
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ bgcolor: "#fdd" }}
          onClick={() => onViewDetails(data)}
        >
          View Details
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => sendVerificationRequest(data?._id)}
        >
          Send Invitation
        </Button>
      </Stack>
    </Paper>
  );
};

const CandidateDetailsModal = ({ open, handleClose, candidate }) => {
  if (!candidate) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Candidate Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          <strong>Name:</strong> {candidate.username}
        </Typography>
        <Typography variant="body1">
          <strong>Specialization:</strong> {candidate.specialization}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {candidate.role}
        </Typography>
        <Typography variant="body1">
          <strong>Type:</strong> {candidate.type}
        </Typography>
        <Typography variant="body1">
          <strong>Experience Level:</strong> {candidate.experience}
        </Typography>
        <Typography variant="body1">
          <strong>Salary Expectation:</strong> {candidate.salary}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Work History
        </Typography>
        {candidate.workHistory.length > 0 ? (
          candidate.workHistory.map((job, index) => (
            <Box
              key={index}
              sx={{ mb: 1, pl: 1, borderLeft: "2px solid #ccc" }}
            >
              <Typography variant="body2">
                <strong>Company:</strong> {job.companyName}
              </Typography>
              <Typography variant="body2">
                <strong>Job Title:</strong> {job.jobTitle}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {job.role}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {job.startDate} to {job.endDate}
              </Typography>
              <Typography variant="body2">
                <strong>Experience Level:</strong> {job.experienceLevel}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No work history available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const SearchResults = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchField, setSearchField] = useState("");

  const candidates = useSelector((state) => state.search.candidates);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const userId = user?.profileId;

  const sendVerificationRequest = async (id) => {
    await employerApi.sendConnectionRequest({
      candidateId: id,
      employerId: userId,
      jobId: jobId,
      outreachMessage:
        "Your profile matches our opening. Would you be interested in learning more?",
    });
  };

  const handleViewDetails = (candidate) => {
    const firstName = candidate?.personalInfo?.firstName ?? "";
    const lastName = candidate?.personalInfo?.lastName ?? "";
    const fullName = `${censorName(firstName)} ${censorName(lastName)}`;

    const normalizedCandidate = {
      username: fullName,
      specialization: candidate?.personalInfo?.specialization ?? "-",
      role: candidate?.workHistory?.[0]?.role ?? "-",
      experience: candidate?.workHistory?.[0]?.experienceLevel ?? "-",
      type: candidate?.basicInfo?.workStatus ?? "-",
      salary: `$${candidate?.jobPreference?.salaryExpectation?.min ?? "-"}/hr`,
      workHistory: candidate?.workHistory ?? [],
    };

    setSelectedCandidate(normalizedCandidate);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Search"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1 }}>
        {candidates?.length > 0 ? (
          candidates
            .filter((c) =>
              `${c.personalInfo?.firstName ?? ""} ${
                c.personalInfo?.lastName ?? ""
              }`
                .toLowerCase()
                .includes(searchField.toLowerCase())
            )
            .map((c, index) => (
              <CandidateCard
                key={index}
                data={c}
                onViewDetails={handleViewDetails}
                sendVerificationRequest={() => sendVerificationRequest(c?._id)}
              />
            ))
        ) : (
          <Typography variant="body2">No candidates found.</Typography>
        )}
      </Box>

      <CandidateDetailsModal
        open={modalOpen}
        handleClose={handleClose}
        candidate={selectedCandidate}
      />
    </Box>
  );
};

export default SearchResults;
