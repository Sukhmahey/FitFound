import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { candidateApi } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import { Box, Typography, Paper } from "@mui/material";

const primaryColor = "#0E3A62";
const accentColor = "#3B67F6";
const gridColor = "#e0e0e0";

const ProfileVisibility = () => {
  const { user } = useAuth();
  const [visibilityData, setVisibilityData] = useState([]);

  useEffect(() => {
    candidateApi
      .getVisibilityTimeline(user.profileId)
      .then((result) => {
        setVisibilityData([...result.data]);
      })
      .catch((err) => console.error("Error fetching visibility data", err));
  }, [user.profileId]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 4,
        borderRadius: 3,
        backgroundColor: "#F5F7FA",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          mb: 2,
          color: primaryColor,
        }}
      >
        Profile Visibility Over Time
      </Typography>

      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={visibilityData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              tick={{ fontFamily: "Figtree, sans-serif", fontSize: 12 }}
            />
            <YAxis tick={{ fontFamily: "Figtree, sans-serif", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                fontFamily: "Figtree, sans-serif",
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="appearances"
              stroke={accentColor}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ProfileVisibility;
