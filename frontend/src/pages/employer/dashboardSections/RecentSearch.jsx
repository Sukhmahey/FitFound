import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { LocationOn, AttachMoney } from "@mui/icons-material";

import { useAuth } from "../../../contexts/AuthContext";
import { employerApi, candidateApi } from "../../../services/api";

const primaryColor = "#062F54";
const secondaryColor = "#F5F7FA";
const skillColors = ["#E3F2FD", "#FCE4EC", "#FFF3E0", "#E8F5E9", "#F3E5F5"];

const censorName = (firstName = "", lastName = "") => {
  const censor = (name) =>
    name.length > 0 ? name[0] + "*".repeat(Math.max(3, name.length - 1)) : "";
  return `${censor(firstName)} ${censor(lastName)}`;
};

const RecentSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const employerId = user.profileId;

  useEffect(() => {
    employerApi
      .getLastJobSearch(employerId)
      .then((result) => {
        const candidateIds = result.data.topMatchedCandidates;
        setJob(result.data);

        return Promise.all(
          candidateIds.map((id) =>
            candidateApi.getProfileById(id).then((result) => result.data)
          )
        );
      })
      .then((result) => {
        setCandidates(result);
      })
      .catch((error) => {
        console.log(error);
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
    <Box sx={{ p: 2 }} fullWidth>
      <Typography
        sx={{
          mb: 3,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 20,
          color: primaryColor,
          textAlign: isMobile ? "center" : "left",
        }}
      >
        {`Recent Search "${job?.jobTitle || "No searches"}"`}
      </Typography>

      {candidates.length > 0 && (
        <Typography
          sx={{
            mb: 3,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: primaryColor,
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Top Candidates
        </Typography>
      )}

      <Grid container direction="column" spacing={2}>
        {candidates.length > 0 ? (
          candidates.map((candidate) => {
            const { firstName, lastName } = candidate?.personalInfo || {};
            return (
              <Box
                key={candidate._id}
                sx={{
                  width: "100%",
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
                  <Avatar
                    src="https://via.placeholder.com/40"
                    sx={{ width: 56, height: 56 }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: 16,
                        color: primaryColor,
                      }}
                    >
                      {censorName(firstName, lastName)}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationOn
                          sx={{ fontSize: 16, color: primaryColor }}
                        />
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AttachMoney
                          sx={{ fontSize: 16, color: primaryColor }}
                        />
                        <Typography
                          sx={{
                            fontFamily: "Figtree, sans-serif",
                            fontSize: 13,
                            color: "#555",
                            fontWeight: 600,
                          }}
                        >
                          {`${job.salaryRange?.min || ""}${
                            job.salaryRange?.perHour ? "CAD" : "K CAD"
                          } - ${job.salaryRange?.max || ""}${
                            job.salaryRange?.perHour ? "CAD" : "K CAD"
                          } ${
                            job.salaryRange?.perHour ? "Per Hour" : "Per Year"
                          }`}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {candidate.skills && candidate.skills.length > 0
                        ? candidate.skills.map((skill, idx) => (
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
                    mt: { xs: 2, md: 0 },
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
              </Box>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                backgroundColor: "#fff",
                padding: 4,
                textAlign: "center",
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  color: primaryColor,
                  mb: 1,
                }}
              >
                Welcome to your dashboard!
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  color: "#666",
                  fontSize: 14,
                  mb: 3,
                }}
              >
                You haven't started searching for candidates yet. Start
                exploring now and find the best talent for your team.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/employer/search")}
                sx={{
                  backgroundColor: primaryColor,
                  fontFamily: "Figtree, sans-serif",
                  borderRadius: 3,
                  textTransform: "none",
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#041f39",
                  },
                }}
              >
                Start Searching
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Modal */}
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
                {censorName(
                  selectedCandidate?.personalInfo?.firstName,
                  selectedCandidate?.personalInfo?.lastName
                )}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Main role:</strong>{" "}
                {`${selectedCandidate?.basicInfo?.bio || "No info"}`}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> Hidden
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Phone Number:</strong> Hidden
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RecentSearch;
