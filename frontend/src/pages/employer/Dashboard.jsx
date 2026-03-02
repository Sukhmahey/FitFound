import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";

import { AppInfoContext } from "../../contexts/AppInfoContext";
import PopularTech from "./dashboardSections/PopularTech";
import RecentSearch from "./dashboardSections/RecentSearch";

const primaryColor = "#062F54";

const StatCard = ({ label, value, description }) => (
  <Paper
    elevation={2}
    sx={{
      flex: 1,
      minWidth: 200,
      p: 3,
      borderRadius: 3,
    }}
  >
    <Typography
      sx={{
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700,
        fontSize: 24,
        color: primaryColor,
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: "Figtree, sans-serif",
        fontWeight: 500,
        color: "#333",
      }}
    >
      {label}
    </Typography>
    {description && (
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          color: "#666",
          fontFamily: "Figtree, sans-serif",
        }}
      >
        {description}
      </Typography>
    )}
  </Paper>
);

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Dashboard" });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          color: primaryColor,
        }}
      >
        Welcome back 👋
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        <StatCard
          label="Active job postings"
          value={3}
          description="Demo data: number of roles currently visible to candidates."
        />
        <StatCard
          label="Candidates viewed"
          value={18}
          description="Total unique profiles viewed in your recent searches."
        />
        <StatCard
          label="Pending follow-ups"
          value={5}
          description="Shortlisted candidates waiting for your next action."
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px dashed #ccc",
          backgroundColor: "#F8FBFF",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            mb: 1,
            color: primaryColor,
          }}
        >
          Start a new search
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: "#555",
            fontFamily: "Figtree, sans-serif",
          }}
        >
          Create a new job brief and we’ll help you surface the most relevant
          candidates for that role.
        </Typography>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: primaryColor,
            "&:hover": { backgroundColor: "#041f39" },
          }}
          onClick={() => navigate("/employer/create-form")}
        >
          Create new job
        </Button>
      </Paper>

      <Stack spacing={3}>
        <PopularTech />
        <RecentSearch />
      </Stack>
    </Container>
  );
};

export default EmployerDashboard;
