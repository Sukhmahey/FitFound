import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { candidateApi } from "../../../services/api";

const RecommendedActions = () => {
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_SINDY_API;
  const GEMINI_API_URL = process.env.REACT_APP_GEMINI_SINDY_API_URL;

  const { user } = useAuth();
  const [userRole, setUserRole] = useState("");
  const [userSkills, setUserSkills] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // candidateApi
    //   .getProfileById(user.profileId)
    //   .then((result) => {
    //     let skillsString = result.data.skills.map((s) => s.skill).join(", ");
    //     setUserRole(result.data.basicInfo.bio);
    //     setUserSkills(skillsString);
    //   })
    candidateApi
  .getProfileById(user.profileId)
  .then((result) => {
  
    const skillsArray = result.data.skills.map((s) => s.skill);
    setUserRole(result.data.basicInfo.bio);
    setUserSkills(skillsArray); 
   
  })
.catch((error) => console.log(error));
  }, [user.profileId]);

  useEffect(() => {
    if (userSkills && userRole) {
      setPrompt(
        `I am a/an ${userRole}. Based on the current job market requirements, give me exactly three technologies or skills I should add to my profile to increase visibility on job platforms. Exclude the following technologies that I already know: ${userSkills.join(", ")}. Only return a simple list of names, with no extra explanation, in a single line, splitted by comma (,). Don't add anything else at the beginning or ending.`
      );
    }
  }, [userSkills, userRole]);

  useEffect(() => {
    if (prompt.length > 10) {
      axios
        .post(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((result) => {
          const text = result.data.candidates[0].content.parts[0].text;
          const skills = text.split(",").map((skill) => skill.trim());
          setRecommendations(skills);
        })
        .catch(() => setRecommendations([]));
    }
  }, [prompt]);

  // const handleAddClick = (skill) => {
  //   candidateApi
  //     .updateSkills(user.userId, { skills: [{ skill }] })
  //     .then(() => {
  //       setMessage(`The skill "${skill}" has been added to your profile.`);
  //       setMessageSeverity("success");
  //       setOpenSnackbar(true);
  //       setRecommendations(recommendations.filter((item) => item !== skill));
  //     })
  //     .catch((err) => {
  //       setMessage(err.response?.data?.details || "An error occurred.");
  //       setMessageSeverity("error");
  //       setOpenSnackbar(true);
  //     });
  // };

  const handleAddClick = (skill) => {
 
  const updatedSkills = Array.from(new Set([...userSkills, skill]));

  const skillsPayload = updatedSkills.map((s) => ({ skill: s }));

  candidateApi
    .updateSkills(user.userId, { skills: skillsPayload })
    .then(() => {
      setUserSkills(updatedSkills); 
      setMessage(`The skill "${skill}" has been added to your profile.`);
      setMessageSeverity("success");
      setOpenSnackbar(true);
      setRecommendations(recommendations.filter((item) => item !== skill));
    })
    .catch((err) => {
      setMessage(err.response?.data?.details || "An error occurred.");
      setMessageSeverity("error");
      setOpenSnackbar(true);
    });
};

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          color: "#0E3A62",
          mb: 2,
        }}
      >
        Recommended Actions
      </Typography>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={messageSeverity}
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      <Stack spacing={2}>
        {recommendations.map((recommendation, idx) => (
          <Paper
            key={idx}
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              backgroundColor: "#EDF9FF",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontSize: 14,
                  mb: 0.5,
                }}
              >
                Add <strong>"{recommendation}"</strong> to your profile to
                appear in more searches as a “{userRole}”.
              </Typography>
            </Box>

            <Button
              onClick={() => handleAddClick(recommendation)}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#0E3A62",
                fontFamily: "Figtree, sans-serif",
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 1,
                "&:hover": { backgroundColor: "#062F54" },
              }}
            >
              Add Skill
            </Button>
          </Paper>
        ))}
      </Stack>

      {recommendations.length === 0 && (
        <Typography
          sx={{
            fontFamily: "Figtree, sans-serif",
            color: "#666",
            fontSize: 14,
            textAlign: "center",
            mt: 2,
          }}
        >
          No recommendations at the moment.
        </Typography>
      )}
    </Box>
  );
};

export default RecommendedActions;
