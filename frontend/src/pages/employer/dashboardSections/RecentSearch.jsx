import { useEffect, useState } from "react";
import { employerApi, candidateApi } from "../../../services/api";

import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocationOn, AttachMoney } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";

const primaryColor = "#062F54";
const secondaryColor = "#F5F7FA";
const skillColors = ["#E3F2FD", "#FCE4EC", "#FFF3E0", "#E8F5E9", "#F3E5F5"];

const RecentSearch = () => {
    const { user } = useAuth();
    const [job, setJob] = useState({});
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const employerId = user.profileId;
    


    useEffect(() => {
      // console.log(props.userProfile._id);
        
      employerApi.getLastJobSearch(employerId) // employerId for testing: "6868603e0d6db40517c6f95b"
      .then( result => {
          const candidateIds = result.data.topMatchedCandidates;
          setJob(result.data);

          return Promise.all( candidateIds.map( id => (
          candidateApi.getProfileById(id)
          .then(result => {
              // console.log(result.data);
              return result.data;
              })
          )));

      })
        .then ( result => {
        setCandidates(result);
        // console.log(result);
      })
        .catch( error => {
        // console.log(error);
      });
        
        
        

    }, []);

    const handleViewDetails = (candidate) => {
      setSelectedCandidate(candidate);
      setOpenModal(true);
    };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCandidate(null);
  };

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                sx={{
                mb: 3,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: primaryColor,
                }}
            >
                {`Recent Search "${job?.jobTitle || 'No searches'}"`}
            </Typography>

            <Typography
                sx={{
                mb: 3,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: primaryColor,
                }}
            >
                Top Candiates
            </Typography>

      <Stack spacing={2}>
        {candidates.length > 0 && candidates.map(candidate => (
          <Box
            key={candidate._id}
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              p: 3,
              bgcolor: secondaryColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src="https://via.placeholder.com/40" sx={{ width: 56, height: 56 }} />

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: primaryColor,
                  }}
                >
                    {` ${candidate?.personalInfo?.lastName || ''} `}
                    {` ${candidate?.personalInfo?.firstName || ''} `}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: primaryColor }} />
                    <Typography
                      sx={{
                        fontFamily: "Figtree, sans-serif",
                        fontSize: 13,
                        color: "#555",
                      }}
                    >
                      {job.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AttachMoney sx={{ fontSize: 16, color: primaryColor }} />
                    <Typography
                      sx={{
                        fontFamily: "Figtree, sans-serif",
                        fontSize: 13,
                        color: "#555",
                        fontWeight: 600,
                      }}
                    >
                       {` ${job.salaryRange.min}${job.salaryRange.perHour ? "CAD" : "K CAD" }
                        -
                            ${job.salaryRange.max}${job.salaryRange.perHour ? "CAD" : "K CAD" }
                            ${job.salaryRange.perHour ? "Per Hour" : "Per Year." }
                        `}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {candidate.skills && candidate.skills.length > 0
                        ? candidate.skills.map((skill, idx)  => (
                        <Chip
                            key={skill._id}
                            label={skill.skill}
                            size="small"
                            sx={{
                                fontFamily: "Figtree, sans-serif",
                                bgcolor: skillColors[idx % skillColors.length],
                                color: primaryColor,
                            }}
                        />
                        ))
                    : "No skills"}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              <Button
                size="small"
                variant="text"
                onClick={() => handleViewDetails(candidate)}
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  textTransform: "none",
                  fontSize: 12,
                  color: primaryColor,
                }}
              >
                More Details
              </Button>
            </Box>

            <Dialog
              open={openModal}
              onClose={handleCloseModal}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                Candidate Basic Info
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModal}
                  sx={{ position: "absolute", right: 8, top: 8 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent dividers>
                {selectedCandidate && (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong>{" "}
                      {` ${selectedCandidate?.personalInfo?.lastName || ''} `}
                      {` ${selectedCandidate?.personalInfo?.firstName || ''} `}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Main role:</strong>{" "}
                      {` ${selectedCandidate?.basicInfo?.bio || 'No info'} `}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong>{" "}
                      {` ${selectedCandidate?.personalInfo?.email || 'No info'} `}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Phone Number:</strong>{" "}
                      {` ${selectedCandidate?.basicInfo?.phoneNumber || 'No info'} `}
                    </Typography>
                  </Box>
                )}
              </DialogContent>
            </Dialog>

          </Box>

          
        ))}
      </Stack>
    </Box>
    );

};

export default RecentSearch;
