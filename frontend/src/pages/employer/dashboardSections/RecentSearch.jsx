import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Chip,
  Stack,
  Grid,
} from "@mui/material";
import { LocationOn, AttachMoney } from "@mui/icons-material";
import { candidateApi } from "../../../services/api";

const RecentSearch = () => {
  const [candidates, setCandidates] = useState([
    {
      name: "John Doe",
      filters: ["Frontend", "UI/UX"],
      location: "Canada",
      salary: "$50K - $85K",
      skills: ["React", "Figma", "Leadership"],
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Jane Smith",
      filters: ["Backend", "Node.js"],
      location: "USA",
      salary: "$70K - $100K",
      skills: ["Node.js", "MongoDB", "AWS"],
      avatar: "https://via.placeholder.com/40",
    },
  ]);

  const primaryColor = "#062F54";
  const secondaryColor = "#F5F7FA";
  const skillColors = ["#E3F2FD", "#FCE4EC", "#FFF3E0", "#E8F5E9", "#F3E5F5"];

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
        Top Candidates
      </Typography>

      <Stack spacing={2}>
        {candidates.map((candidate, index) => (
          <Box
            key={index}
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
              <Avatar src={candidate.avatar} sx={{ width: 56, height: 56 }} />

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: primaryColor,
                  }}
                >
                  {candidate.name}
                </Typography>

                <Box sx={{ mt: 0.5, mb: 1 }}>
                  {candidate.filters.map((filter, idx) => (
                    <Chip
                      key={idx}
                      label={filter}
                      size="small"
                      sx={{
                        mr: 1,
                        fontFamily: "Figtree, sans-serif",
                        bgcolor: "#e0e0e0",
                        color: primaryColor,
                      }}
                    />
                  ))}
                </Box>

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
                      {candidate.location}
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
                      {candidate.salary}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {candidate.skills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      size="small"
                      sx={{
                        fontFamily: "Figtree, sans-serif",
                        bgcolor: skillColors[idx % skillColors.length],
                        color: primaryColor,
                      }}
                    />
                  ))}
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
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  textTransform: "none",
                  fontSize: 12,
                  color: primaryColor,
                }}
              >
                More Details
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  backgroundColor: primaryColor,
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#051d33",
                  },
                }}
              >
                Send Invitation
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default RecentSearch;
