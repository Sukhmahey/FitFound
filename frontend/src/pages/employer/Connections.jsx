import React, { useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";

const employees = new Array(4).fill({
  username: "XYZ",
  designation: "FrontEnd Developer",
  location: "Burnaby",
  manager: "Tom Cruise (Manager Burnaby)",
});

const TabPanel = ({ children, value, index }) => {
  return value === index ? <Box p={2}>{children}</Box> : null;
};

const Connections = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
      {/* Tabs */}
      <AppBar position="static" color="default" elevation={0}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Current Employees" />
          <Tab label="Accepted Invitation" />
          <Tab label="Task/Requests" />
        </Tabs>
      </AppBar>

      {/* Search */}
      <Box my={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {/* <SearchIcon /> */}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tab Panel */}
      <TabPanel value={tabIndex} index={0}>
        <Box
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            pr: 1,
          }}
        >
          {employees.map((emp, index) => (
            <Card
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 2,
                borderRadius: 2,
              }}
            >
              <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
              <CardContent sx={{ flexGrow: 1, p: 0 }}>
                <Typography variant="subtitle1">
                  <strong>UserName:</strong> {emp.username}
                </Typography>
                <Typography variant="body2">
                  <strong>Designation:</strong> {emp.designation}
                </Typography>
                <Typography variant="body2">
                  <strong>Work Location:</strong> {emp.location}
                </Typography>
                <Typography variant="body2">
                  <strong>Managed By:</strong> {emp.manager}
                </Typography>
              </CardContent>
              <Box>
                <Button variant="outlined">View Details</Button>
              </Box>
            </Card>
          ))}
        </Box>
      </TabPanel>
    </Box>
  );
};

export default Connections;
