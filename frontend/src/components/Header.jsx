import { useContext, useState } from "react";
import { AppInfoContext } from "../contexts/AppInfoContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.svg";
import DashboardBell from "../pages/DashboardBell";

const Header = () => {
  const { appGeneralInfo } = useContext(AppInfoContext);
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:899px)");
  const primaryColor = "#062F54";

  const settingsPath =
    user?.role === "candidate"
      ? "/candidate/settings"
      : user?.role === "employer"
      ? "/employer/settings"
      : "/settings";

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "#fff",
          borderBottom: "1px solid #ddd",
          height: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isMobile ? (
          <>
            {/* Left: Hamburger */}
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: primaryColor }} />
            </IconButton>

            {/* Center: Logo */}
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              <img src={logo} alt="FitFound Logo" style={{ height: 34 }} />
            </Box>

            {/* Right: Notifications */}
            <Box>
              <DashboardBell />
            </Box>
          </>
        ) : (
          <>
            {/* Left: Page title */}
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

            {/* Right: Notifications & Settings */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <DashboardBell />
              <Link to={settingsPath} style={{ textDecoration: "none" }}>
                <IconButton>
                  <Avatar sx={{ bgcolor: primaryColor, width: 32, height: 32 }}>
                    <AccountCircleIcon sx={{ color: "#fff", fontSize: 20 }} />
                  </Avatar>
                </IconButton>
              </Link>
            </Box>
          </>
        )}
      </Box>

      {/* Drawer (only Settings for mobile) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              mb: 2,
              color: primaryColor,
            }}
          >
            Menu
          </Typography>
          <List>
            <Link
              to={settingsPath}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: primaryColor, width: 32, height: 32 }}>
                    <AccountCircleIcon sx={{ fontSize: 20, color: "#fff" }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary="My Account" />
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
