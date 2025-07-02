import React, { useEffect, useState } from "react";
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
  Stack,
} from "@mui/material";
import { employerApi } from "../../services/api";

const employees = new Array(4).fill({
  username: "XYZ",
  designation: "FrontEnd Developer",
  location: "Burnaby",
  manager: "George (Manager Burnaby)",
});

const employeeList = [
  {
    name: "XYZ",
    designation: "FrontEnd Developer",
    location: "Burnaby",
    manager: "Tom Cruise (Manager Burnaby)",
    fromDate: "12/3/2015",
  },
  {
    name: "XYZ",
    designation: "FrontEnd Developer",
    location: "Burnaby",
    manager: "Tom Cruise (Manager Burnaby)",
    fromDate: "12/3/2015",
  },
  {
    name: "XYZ",
    designation: "FrontEnd Developer",
    location: "Burnaby",
    manager: "Tom Cruise (Manager Burnaby)",
    fromDate: "12/3/2015",
  },
];

const TabPanel = ({ children, value, index }) => {
  return value === index ? <Box p={2}>{children}</Box> : null;
};

const TaskCard = ({ name, designation, location, manager, fromDate }) => (
  <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Avatar sx={{ width: 64, height: 64, mr: 2 }} />
      <Box>
        <Typography variant="body1">
          <strong>UserName:</strong> {name}
        </Typography>
        <Typography variant="body1">
          <strong>Designation:</strong> {designation}
        </Typography>
        <Typography variant="body1">
          <strong>Work Location:</strong> {location}
        </Typography>
        <Typography variant="body1">
          <strong>Managed By:</strong> {manager}
        </Typography>
      </Box>
    </Box>

    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Work Authorization Badge
      </Typography>
      <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 2 }}>
        <Typography>
          <strong>{designation}</strong>
        </Typography>
        <Typography>From {fromDate} To “Current”</Typography>
        <Typography>Roles ------</Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined">Verify</Button>
        </Box>
      </Box>
    </Box>
  </Card>
);

const Connections = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState([]);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);
  const userId = localStorage.getItem("userId");

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  const getCurrentEmployees = async (userId) => {
    const employeeData = await employerApi.fetchCurrentEmployees(userId);
    setCurrentEmployee(employeeData?.data);
    const acceptedCandidates = await employerApi.fetchAcceptedCandidates(
      userId
    );
    setAcceptedCandidates(acceptedCandidates?.data);
    console.log("employee Data", employeeData);
  };

  useEffect(() => {
    getCurrentEmployees(userId);
  }, []);

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
          {currentEmployee.map((emp, index) => (
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
      <TabPanel value={tabIndex} index={1}>
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
                <Button variant="outlined">Hired</Button>
                <Button variant="outlined">View Details</Button>
              </Box>
            </Card>
          ))}
        </Box>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Current Employees
          </Typography>
          <Stack spacing={3}>
            {employeeList.map((emp, index) => (
              <TaskCard key={index} {...emp} />
            ))}
          </Stack>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default Connections;
