import { useContext } from "react";
import { AppInfoContext } from "../contexts/AppInfoContext";
import { Link } from "react-router-dom";
import DashboardBell from "../pages/DashboardBell";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Grid,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/AccountCircle"; // Profile icon as per your request

const Header = () => {
  const { appGeneralInfo } = useContext(AppInfoContext);
  const { user } = useAuth();

  const settingsPath =
    user?.role === "candidate"
      ? "/candidate/settings"
      : user?.role === "employer"
      ? "/employer/settings"
      : "/settings";

  const primaryColor = "#062F54";

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        // zIndex: 1000,
        bgcolor: "#fff",
        borderBottom: "1px solid #ddd",
        height: 64,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Page Title */}
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: 18,
          color: primaryColor,
        }}
      >
        {appGeneralInfo.pageTitle || "Dashboard"}
      </Typography>

      {/* Icons Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <div>
          <DashboardBell></DashboardBell>
        </div>

        <Link to={settingsPath} style={{ textDecoration: "none" }}>
          <IconButton>
            <Avatar sx={{ bgcolor: primaryColor, width: 32, height: 32 }}>
              <SettingsIcon sx={{ color: "#fff", fontSize: 20 }} />
            </Avatar>
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default Header;
