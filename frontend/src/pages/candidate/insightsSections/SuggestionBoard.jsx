import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack, CircularProgress } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { candidateApi } from "../../../services/api";

const primaryColor = "#0E3A62";
const highlightColor = "#EDF9FF";

const SuggestionBoard = () => {
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_SINDY_API;
  const GEMINI_API_URL = process.env.REACT_APP_GEMINI_SINDY_API_URL;
  const { user } = useAuth();

  const [userRole, setUserRole] = useState("");
  const [userProfile, setUserProfile] = useState({});
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    candidateApi
      .getProfileById(user.profileId)
      .then((result) => {
        setUserRole(result.data.basicInfo.bio);
        setUserProfile(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.profileId]);

  useEffect(() => {
    if (userProfile && userRole) {
      const {
        personalInfo,
        basicInfo,
        portfolio,
        _id,
        userId,
        ...cleanProfile
      } = userProfile;

      const formattedPrompt = `I am a/an ${userRole}. Based on the current job market requirements, give me exactly two suggestions to improve my profile. This is my profile: ${cleanProfile}. Focus only on recommendations related to education, level, salary, job references, work achievements, or other professional growth aspects — excluding technologies or skills I could add.
      Return a simple list of two suggestions in a single line, following these exact rules:
      Each suggestion must have a clear title (maximum 8 words).
      Use a colon (:) to separate the title from its explanation.
      Use a semicolon (;) to separate the two suggestions, but do not place a semicolon after the second suggestion.
      Do not use the colon (:) or semicolon (;) for anything else except separating titles from descriptions (:) and suggestions (;)
      Do not use any other special characters (* - "" # $)
      Do not add any introduction, closing sentence, or period (.) at the end`;

      setPrompt(formattedPrompt);
    }
  }, [userProfile, userRole]);

  useEffect(() => {
    if (prompt.length > 10) {
      setLoading(true);
      axios
        .post(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => {
          const responseText =
            result.data.candidates[0].content.parts[0].text.replace(/\./g, "");
          setSuggestions(responseText.split(";").map((s) => s.trim()));
          setLoading(false);
        })
        .catch((error) => {
          setSuggestions([]);
          setLoading(false);
        });
    }
  }, [prompt]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          color: primaryColor,
          mb: 2,
        }}
      >
        AI-Generated Suggestions
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={32} sx={{ color: primaryColor }} />
        </Box>
      ) : (
        <Stack spacing={2}>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => {
              const [title, explanation] = suggestion.split(":");
              return (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: highlightColor,
                    borderLeft: `4px solid ${primaryColor}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      color: primaryColor,
                      mb: 1,
                    }}
                  >
                    {title.trim()}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Figtree, sans-serif",
                      fontSize: 14,
                      color: "#333",
                    }}
                  >
                    {explanation.trim()}
                  </Typography>
                </Paper>
              );
            })
          ) : (
            <Typography
              sx={{
                fontFamily: "Figtree, sans-serif",
                color: "#666",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              No suggestions yet.
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default SuggestionBoard;
