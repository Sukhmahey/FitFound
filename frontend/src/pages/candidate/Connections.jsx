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
import { useAuth } from "../../contexts/AuthContext";

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

const TaskCard = ({ task }) => {
  console.log("Taskk", task);

  const verifyRequest = async () => {
    await employerApi.verifyTask(task?._id);
  };

  return (
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
            <strong>UserName:</strong>{" "}
            {task?.candidateId?.personalInfo?.firstName}
          </Typography>
          {/* <Typography variant="body1">
            <strong>Designation:</strong> {designation}
          </Typography> */}
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Work Authorization Badge
        </Typography>
        <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 2 }}>
          {/* <Typography>
            <strong>{task?.employmentDates?.startDate}</strong>
          </Typography> */}
          <Typography>
            From {task?.employmentDates?.startDate} To “Current”
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              onClick={() => {
                verifyRequest();
              }}
              variant="outlined"
            >
              Verify
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const Connections = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState([]);

  const { user } = useAuth();

  const userId = user?.profileId;

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  const getCurrentEmployees = async (userId) => {
    const employeeData = await employerApi.fetchCurrentEmployees(userId);
    // console.log("pendingTasks", pendingTasks);
  };

  useEffect(() => {
    getCurrentEmployees(userId);
  }, []);

  const hireCandidate = async (id) => {
    await employerApi.setCandidateToHired(id);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
      {/* Tabs */}
      <AppBar position="static" color="default" elevation={0}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Pending" />
          <Tab label="Accepted" />
          <Tab label="Archived" />
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
    </Box>
  );
};

export default Connections;
