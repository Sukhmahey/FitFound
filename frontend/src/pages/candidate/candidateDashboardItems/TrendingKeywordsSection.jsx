import React , {useState, useEffect} from "react";
import { Box, Typography, Paper, Divider, Chip, Stack } from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import MuiAlert from "@mui/material/Alert";

const primaryColor = "#0E3A62";
const newSkillColor = "#3B67F6";
const existingSkillColor = "#A5CCF7";

function TrendingKeywordsSection({
  suggestedSkills = [],
  alreadySkills = [],
  onAddSkill = () => {},
}) {
   const [justAdded, setJustAdded] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedSkill, setAddedSkill] = useState("");

  const normalizeSkill = (skill) => {
  if (!skill || typeof skill !== "string") return skill;

  const lower = skill.toLowerCase().trim();

  
  const cleaned = lower.replace(/\.(js|ts|jsx|tsx)$/, "");

  
  const aliases = {
    "react.js": "react",
    "vue": "vue",
    "vue.js": "vue",
    "node": "node",
    "node.js": "node",
    "javascript": "js",
    "typescript": "ts"
  };

  return aliases[cleaned] || cleaned;
};

  // const skillNamesSet = new Set(
  //   (alreadySkills || []).map(s =>
  //     typeof s === "string" ? s.toLowerCase() : s
  //   )
  // );
  const skillNamesSet = new Set(
  (alreadySkills || []).map(normalizeSkill)
);

  
  // const newSkills = (suggestedSkills || []).filter(
  //   (skill) =>
  //     !skillNamesSet.has(skill.toLowerCase()) &&
  //     !justAdded.includes(skill.toLowerCase())
  // );
   const newSkills = (suggestedSkills || []).filter(
  (skill) =>
    !skillNamesSet.has(normalizeSkill(skill)) &&
    !justAdded.includes(normalizeSkill(skill))
);

  const existingSkills = Array.from(
    new Set([
      ...(alreadySkills || []),
      ...justAdded.filter(s => !skillNamesSet.has(s))
    ])
  );
// const handleAdd = (skill) => {
//     onAddSkill(skill);
//     setJustAdded((prev) => [...prev, skill.toLowerCase()]);
//     setAddedSkill(skill);
//     setSnackbarOpen(true);
//   };

const handleAdd = (skill) => {
  const normalized = normalizeSkill(skill);
  onAddSkill(skill); // Send original for display/storage
  setJustAdded((prev) => [...prev, normalized]);
  setAddedSkill(skill);
  setSnackbarOpen(true);
};
  // console.log(alreadySkills)
  

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
              {newSkills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  clickable
                  onClick={() => handleAdd(skill)}
                  icon={<AddIcon sx={{ color: "white", background:"white" , borderRadius: 50 }} />}
                  sx={{
                    backgroundColor: newSkillColor,
                    color: "white",
                    fontFamily: "Figtree, sans-serif",
                    fontSize: 13,
                    "&:hover": { backgroundColor: "#2751B8" },
                    transition: "background 0.2s",
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
