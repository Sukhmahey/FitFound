import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { employerApi, candidateApi } from "../services/api";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InsightsIcon from "@mui/icons-material/Insights";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";

import logo from "../assets/logo.svg";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({});
  const [activeTab, setActiveTab] = useState(""); // Start with empty string

  const primaryColor = "#062F54";
  const excludedPaths = ["/candidate/onboarding"];

  useEffect(() => {
    // Set activeTab based on current path
    const currentPath = location.pathname.split("/").pop();
    setActiveTab(currentPath || "dashboard"); // Fallback to dashboard

    if (!user) return;

    const shouldSkipApi = excludedPaths.some((path) =>
      location.pathname.startsWith(path)
    );
    if (shouldSkipApi) return;

    if (user.role === "employer") {
      employerApi
        .getEmployerProfile(user.userId)
        .then((result) => setUserProfile(result.data))
        .catch((error) => console.log(error));
    } else if (user.role === "candidate") {
      candidateApi
        .getProfileByUserId(user.userId)
        .then((result) => setUserProfile(result.data))
        .catch((error) => console.log(error));
    }
  }, [user, location.pathname]);

  const goTo = (tabName) => {
    setActiveTab(tabName);
    const segments = location.pathname.split("/");
    segments[segments.length - 1] = tabName;
    const newPath = segments.join("/");
    navigate(newPath);
  };

  const avatarUrl =
    userProfile?.companyLogo || "https://via.placeholder.com/40";
  const displayName =
    user?.role === "candidate"
      ? userProfile?.personalInfo?.firstName || "Candidate"
      : "Anna Paul";

  const menuItemStyle = (tab) => ({
    borderRadius: "8px",
    bgcolor: activeTab === tab ? "#fff" : "transparent",
    mb: 0.5,
    "&:hover": {
      bgcolor: "#fff",
      "& .MuiListItemIcon-root": { color: primaryColor },
      "& .MuiListItemText-root span": { color: primaryColor, fontWeight: 600 },
    },
    "& .MuiListItemIcon-root": {
      color: activeTab === tab ? primaryColor : "#fff",
      minWidth: 32,
    },
    "& .MuiListItemText-root span": {
      color: activeTab === tab ? primaryColor : "#fff",
      fontWeight: activeTab === tab ? 600 : 400,
    },
  });

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: 250 },
        minHeight: "100vh",
        bgcolor: primaryColor,
        p: 2,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Figtree, sans-serif",
        color: "#fff",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          mb: "8px",
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        <img src={logo} alt="FitFound Logo" style={{ height: "40px" }} />
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

      <List sx={{ flexGrow: 1 }}>
        <ListItemButton
          onClick={() => goTo("dashboard")}
          sx={menuItemStyle("dashboard")}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          onClick={() => goTo("profile")}
          sx={menuItemStyle("profile")}
        >
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </ListItemButton>

        {user?.role === "candidate" && (
          <>
            <ListItemButton
              onClick={() => goTo("ingsights")}
              sx={menuItemStyle("ingsights")}
            >
              <ListItemIcon>
                <InsightsIcon />
              </ListItemIcon>
              <ListItemText primary="Insights" />
            </ListItemButton>

            <ListItemButton
              onClick={() => goTo("badge-verification")}
              sx={menuItemStyle("badge-verification")}
            >
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary="Badge Verification" />
            </ListItemButton>
          </>
        )}

        {user?.role === "employer" && (
          <ListItemButton
            onClick={() => goTo("search")}
            sx={menuItemStyle("search")}
          >
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Candidate Search" />
          </ListItemButton>
        )}

        <ListItemButton
          onClick={() => goTo("connections")}
          sx={menuItemStyle("connections")}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Connections" />
        </ListItemButton>
      </List>

      <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 2 }}>
        <Avatar src={avatarUrl} sx={{ width: 45, height: 45, mr: 1 }} />
        <Box>
          <Typography sx={{ fontSize: 13, color: "#ddd" }}>
            Welcome back
          </Typography>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: 15,
              color: "#fff",
            }}
          >
            {displayName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
