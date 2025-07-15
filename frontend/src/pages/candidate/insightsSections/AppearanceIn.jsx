import React, { useEffect, useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { candidateApi } from "../../../services/api";

const AppearanceIn = () => {
  const { user } = useAuth();
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    candidateApi
      .getAppearanceInSkills(user.profileId)
      .then((result) => {
        setSkillsData([...result.data]);
      })
      .catch((error) => console.log(error));
  }, []);

  function capitalizeWords(text) {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const COLORS = ["#4CAF50", "#E57373"];

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        sx={{
          mb: 3,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 20,
          color: "#062F54",
        }}
      >
        Appearance Insights
      </Typography>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="flex-start"
      >
        {skillsData.length > 0 ? (
          skillsData.map((skill, index) => {
            const appearances =
              Math.trunc(
                (skill.candidateAppearances / skill.totalPlatformSearches) *
                  100 *
                  100
              ) / 100;
            const chartData = [
              { name: "Appearances", value: appearances },
              {
                name: "No Appearances",
                value: Math.trunc((100 - appearances) * 100) / 100,
              },
            ];

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    p: 3,
                    textAlign: "center",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Figtree, sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#0E3A62",
                      mb: 2,
                    }}
                  >
                    {capitalizeWords(skill?.skill || "")}
                  </Typography>

                  <Box sx={{ width: 200, height: 200, mx: "auto" }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          outerRadius={70}
                          innerRadius={35}
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Figtree, sans-serif",
                      mt: 2,
                      color: "#666",
                    }}
                  >
                    {`${skill?.candidateAppearances || 0}/${
                      skill?.totalPlatformSearches || 0
                    } Searches`}
                  </Typography>
                </Paper>
              </Grid>
            );
          })
        ) : (
          <Grid item>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                backgroundColor: "#f3f3f3",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Figtree, sans-serif",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                No skills data available
              </Typography>
              <Box sx={{ width: 200, height: 200, mx: "auto" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[{ name: "No Data", value: 100 }]}
                      dataKey="value"
                      outerRadius={70}
                    >
                      <Cell fill="#ccc" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AppearanceIn;
