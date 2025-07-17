import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InsightsIcon from "@mui/icons-material/Insights";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";

const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    setActiveTab(currentPath || "dashboard");
  }, [location.pathname]);

  const goTo = (tabName) => {
    setActiveTab(tabName);
    const segments = location.pathname.split("/");
    segments[segments.length - 1] = tabName;
    const newPath = segments.join("/");
    navigate(newPath);
  };

  const renderActions = () => {
    const items = [
      {
        label: "Dashboard",
        value: "dashboard",
        icon: <DashboardIcon />,
      },
      {
        label: "Profile",
        value: "profile",
        icon: <AccountCircleIcon />,
      },
      {
        label: "Connections",
        value: "connections",
        icon: <PeopleIcon />,
      },
    ];

    if (user?.role === "candidate") {
      items.splice(2, 0, {
        label: "Insights",
        value: "insights",
        icon: <InsightsIcon />,
      });

      items.push({
        label: "Verification",
        value: "badge-verification",
        icon: <VerifiedUserIcon />,
      });
    } else if (user?.role === "employer") {
      items.splice(2, 0, {
        label: "Search",
        value: "search",
        icon: <SearchIcon />,
      });
    }

    return items.map((item) => (
      <BottomNavigationAction
        key={item.value}
        label={item.label}
        value={item.value}
        icon={item.icon}
      />
    ));
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: "1px solid #ccc",
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={activeTab}
        onChange={(e, newValue) => goTo(newValue)}
      >
        {renderActions()}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;
