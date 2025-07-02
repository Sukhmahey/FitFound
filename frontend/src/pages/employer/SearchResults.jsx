import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { employerApi } from "../../services/api";
import {
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

const candidates = new Array(10).fill({
  username: "candidate12a2t",
  specialization: "React",
  role: "Full Stack Backend Developer",
  type: "Full Time",
  date: "June-08-2025",
  time: "13:33",
  match: "92%",
  salary: "$5000-$10,000/month",
  experience: "4 years",
  location: "Remote",
  email: "candidate@example.com",
  phone: "+1 (123) 456-7890",
});

const CandidateCard = ({ data, onViewDetails, sendVerificationRequest }) => (
  <Paper
    elevation={3}
    sx={{ p: 2, mb: 2, display: "flex", alignItems: "center", borderRadius: 3 }}
  >
    {/* Match % Circle */}
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
      {data.matchingScore}%
    </Box>

    {/* Info Section */}
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="subtitle1">{"-"}</Typography>
      <Typography variant="body2">
        Specialization <strong>{data.mainRole}</strong>
      </Typography>
      <Typography variant="body2">
        Role: <strong>{data.mainRole}</strong> • {data.jobType}
      </Typography>
    </Box>

    {/* Salary + Actions */}
    <Stack spacing={1} alignItems="flex-end">
      <Typography variant="subtitle1" fontWeight="bold">
        {data.salary}
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
        onClick={() => sendVerificationRequest()}
      >
        Send Invitation
      </Button>
    </Stack>
  </Paper>
);

const CandidateDetailsModal = ({ open, handleClose, candidate }) => {
  if (!candidate) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Candidate Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          <strong>Username:</strong> {candidate.username}
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
          <strong>Experience:</strong> {candidate.experience}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {candidate.location}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {candidate.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone:</strong> {candidate.phone}
        </Typography>
        <Typography variant="body1">
          <strong>Salary:</strong> {candidate.salary}
        </Typography>
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
  const [candidateList, setCandidateList] = useState([]);
  const [searchField, setSearchField] = useState("");
  const candidates = useSelector((state) => state.search.candidates);

  const sendVerificationRequest = async () => {
    await employerApi.sendConnectionRequest({
      candidateId: "685f24f147f18e8115e90687",
      employerId: "685f24c547f18e8115e90685",
      jobId: "685f274047f18e8115e90694",
      outreachMessage:
        "Your profile matches our Data Analyst opening. Would you be interested in learning more about Alpha Solutions Group?",
    });
  };

  useEffect(() => {
    console.log("Candidates", candidates);
    setCandidateList(candidates);
  }, [candidates]);

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
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

      {/* Scrollable Container */}
      <Box
        sx={{
          maxHeight: "80vh",
          overflowY: "auto",
          pr: 1,
        }}
      >
        {candidates.map((c, _id) => (
          <CandidateCard
            key={_id}
            data={c}
            onViewDetails={handleViewDetails}
            sendVerificationRequest={sendVerificationRequest}
          />
        ))}
      </Box>

      {/* Modal */}
      <CandidateDetailsModal
        open={modalOpen}
        handleClose={handleClose}
        candidate={selectedCandidate}
      />
    </Box>
  );
};

export default SearchResults;
