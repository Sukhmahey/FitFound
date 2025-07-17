import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { candidateApi } from "../../../services/api";

import CodeIcon from "@mui/icons-material/Code";
import BrushIcon from "@mui/icons-material/Brush";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import StorageIcon from "@mui/icons-material/Storage";
import DevicesIcon from "@mui/icons-material/Devices";

const PopularTech = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    candidateApi
      .getDashboardMainRoleCounts()
      .then((result) => {
        setRoles([...result.data].sort((a, b) => b.count - a.count));
      })
      .catch((error) => console.log(error));
  }, []);

  const primaryColor = "#062F54";

  const cardColors = [
    "#E3F2FD", // Light Blue
    "#FCE4EC", // Pink
    "#FFF3E0", // Orange
    "#E8F5E9", // Green
    "#F3E5F5", // Purple
  ];

  const getIconForRole = (roleName) => {
    const lower = roleName.toLowerCase();
    if (lower.includes("frontend")) return <CodeIcon fontSize="medium" />;
    if (lower.includes("backend")) return <StorageIcon fontSize="medium" />;
    if (lower.includes("ui")) return <BrushIcon fontSize="medium" />;
    if (lower.includes("ux")) return <DesignServicesIcon fontSize="medium" />;
    if (lower.includes("full stack")) return <DevicesIcon fontSize="medium" />;
    return <CodeIcon fontSize="medium" />;
  };

  function capitalizeWords(text) {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

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
        Popular Technologies (As per interested Candidates)
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {roles.map((role, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              width: 220,
              borderRadius: "16px",
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: cardColors[index % cardColors.length],
              minHeight: 160,
            }}
          >
            <Avatar
              sx={{
                bgcolor: primaryColor,
                width: 50,
                height: 50,
                mb: 1,
              }}
            >
              {getIconForRole(role.role)}
            </Avatar>

            <Typography
              sx={{
                fontFamily: "Figtree, sans-serif",
                fontSize: 13,
                color: "#333",
                mb: 1,
                textAlign: "center",
              }}
            >
              “{capitalizeWords(role.role)}”
            </Typography>

            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: primaryColor,
              }}
            >
              {role.count}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Figtree, sans-serif",
                fontSize: 12,
                color: "#555",
              }}
            >
              Candidates
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default PopularTech;
