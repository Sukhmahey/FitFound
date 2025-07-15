import React from "react";
import { Box, Typography, Paper, Divider, Chip, Stack } from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const primaryColor = "#0E3A62";
const newSkillColor = "#3B67F6";
const existingSkillColor = "#A5CCF7";

function TrendingKeywordsSection({ suggestedSkills = [], alreadySkills = [] }) {
  const alreadySet = new Set(alreadySkills.map((s) => s.toLowerCase()));

  const newSkills = suggestedSkills.filter(
    (skill) => !alreadySet.has(skill.toLowerCase())
  );
  const existingSkills = suggestedSkills.filter((skill) =>
    alreadySet.has(skill.toLowerCase())
  );

  return (
    <Box>
      <Divider sx={{ mb: 3 }} />

      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          color: primaryColor,
        }}
      >
        Trending Keywords for You
      </Typography>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          p: 3,
          backgroundColor: "#F5F7FA",
        }}
      >
        {/* New Suggestions */}
        {newSkills.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <NewReleasesIcon sx={{ color: newSkillColor, mr: 1 }} />
              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  color: newSkillColor,
                }}
              >
                New Suggestions
              </Typography>
            </Box>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {newSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{
                    backgroundColor: newSkillColor,
                    color: "white",
                    fontFamily: "Figtree, sans-serif",
                    fontSize: 13,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Already in Your Profile */}
        {existingSkills.length > 0 && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CheckCircleIcon sx={{ color: primaryColor, mr: 1 }} />
              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  color: primaryColor,
                }}
              >
                Already in Your Profile
              </Typography>
            </Box>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {existingSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{
                    backgroundColor: existingSkillColor,
                    color: primaryColor,
                    fontFamily: "Figtree, sans-serif",
                    fontSize: 13,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default TrendingKeywordsSection;
