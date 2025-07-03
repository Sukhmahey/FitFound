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
import { candidateApi } from "../../services/api";
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

const Connections = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [archived, setArchived] = useState([]);

  const { user } = useAuth();

  const userId = user?.profileId;

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  console.log("pending", pending, accepted, archived);

  const getCurrentEmployees = async (userId) => {
    const candidateData = await candidateApi.fetchInteractions(userId);

    setPending(
      (candidateData?.data || []).filter(
        (candidate) =>
          !candidate?.candidateConsentToReveal &&
          candidate?.finalStatus != "rejected"
      )
    );

    setAccepted(
      (candidateData?.data || []).filter(
        (candidate) =>
          candidate?.candidateConsentToReveal &&
          candidate?.finalStatus == "hired"
      )
    );

    setArchived(
      (candidateData?.data || []).filter(
        (candidate) =>
          !candidate?.candidateConsentToReveal &&
          candidate?.finalStatus == "rejected"
      )
    );
  };

  const acceptInvitation = async (id) => {
    await candidateApi.acceptInvitation(id).then(() => {
      getCurrentEmployees();
    });
  };

  const declineInvitation = async (id) => {
    await candidateApi.declineInvitation(id).then(() => {
      getCurrentEmployees();
    });
  };

  useEffect(() => {
    getCurrentEmployees(userId);
  }, []);

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

      <TabPanel value={tabIndex} index={0}>
        <Box
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            pr: 1,
          }}
        >
          {pending.map((emp, index) => (
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
                  <strong>UserName:</strong> {emp?.employerId?.companyName}
                </Typography>
                <Typography variant="body2">
                  <strong>Designation:</strong>{" "}
                  {emp?.employerId?.contactInfo?.designation}
                </Typography>
                <Typography variant="body2">
                  <strong>Sent By:</strong>{" "}
                  {emp?.employerId?.contactInfo?.firstName}
                </Typography>
              </CardContent>
              <Box>
                <Button variant="outlined">View Details</Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    acceptInvitation(emp._id);
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    declineInvitation(emp._id);
                  }}
                >
                  Decline
                </Button>
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
          {accepted.map((emp, index) => (
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
                  <strong>UserName:</strong> {emp?.employerId?.companyName}
                </Typography>
                <Typography variant="body2">
                  <strong>Designation:</strong>{" "}
                  {emp?.employerId?.contactInfo?.designation}
                </Typography>
                <Typography variant="body2">
                  <strong>Sent By:</strong>{" "}
                  {emp?.employerId?.contactInfo?.firstName}
                </Typography>
              </CardContent>
              <Box>
                <Button variant="outlined">View Details</Button>
              </Box>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Box
          sx={{
            maxHeight: "70vh",
            overflowY: "auto",
            pr: 1,
          }}
        >
          {archived.map((emp, index) => (
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
                  <strong>UserName:</strong> {emp?.employerId?.companyName}
                </Typography>
                <Typography variant="body2">
                  <strong>Designation:</strong>{" "}
                  {emp?.employerId?.contactInfo?.designation}
                </Typography>
                <Typography variant="body2">
                  <strong>Sent By:</strong>{" "}
                  {emp?.employerId?.contactInfo?.firstName}
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
