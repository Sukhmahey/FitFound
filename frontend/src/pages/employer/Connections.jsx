// NEW: Added modal to display candidate information on 'View Details' click in employer side

import React, { useEffect, useState, useContext } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,

  DialogActions,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { AppInfoContext } from "../../contexts/AppInfoContext";

const TabPanel = ({ children, value, index }) => {
  return value === index ? <Box p={2}>{children}</Box> : null;
};

// const TaskCard = ({ task, getCurrentEmployees, userId }) => {
//   console.log("tasksks", task);
//   const verifyRequest = async () => {
//     await employerApi.verifyTask(task?._id);
//     getCurrentEmployees(userId);
//   };

//   return (
//     <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           backgroundColor: "#f5f5f5",
//           borderRadius: 2,
//           p: 2,
//         }}
//       >
//         <Avatar sx={{ width: 64, height: 64, mr: 2 }} />
//         <Box>
//           <Typography variant="body1">
//             <strong>UserName:</strong>{" "}
//             {task?.candidateId?.personalInfo?.firstName}
//           </Typography>
//         </Box>
//       </Box>

//       <Box sx={{ mt: 2 }}>
//         <Typography variant="h6" gutterBottom>
//           Work Authorization Badge
//         </Typography>
//         <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 2 }}>
//           <Typography>
//             From {task?.employmentDates?.startDate} To “Current”
//           </Typography>
//           <Box sx={{ mt: 2 }}>
//             <Button onClick={verifyRequest} variant="outlined">
//               Verify
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Card>
//   );
// };

const TaskCard = ({ task, getCurrentEmployees, userId }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  // const verifyRequest = async () => {
  //   await employerApi.verifyTask(task?._id);
  //   getCurrentEmployees(userId);
  // };
  const handleVerifyClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    await employerApi.verifyTask(task?._id);
    getCurrentEmployees(userId);
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const personal = task?.candidateId?.personalInfo || {};

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
          <Typography variant="subtitle1">
            <strong>Name:</strong> {personal.firstName} {personal.lastName}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {personal.email || "N/A"}
          </Typography>

          <Typography variant="body2">
            <strong>Role:</strong> {task?.position || "N/A"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Work Authorization Badge
        </Typography>
        <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 2 }}>
          <Typography>
            From {task?.employmentDates?.startDate} To{" "}
            {task?.employmentDates?.endDate || "Current"}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleVerifyClick} variant="outlined">
              Verify
            </Button>
          </Box>
        </Box>
      </Box>
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Verification</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to verify this candidate?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Yes, Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
const Connections = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);
  const { user } = useAuth();

  console.log("PendingTaskss", pendingTasks);

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Connections" });
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const userId = user?.profileId;

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCandidate(null);
  };

  const getCurrentEmployees = async (userId) => {
    const employeeData = await employerApi.fetchCurrentEmployees(userId);
    console.log("employeeData", employeeData?.data);
    setCurrentEmployee(employeeData?.data);
    const accepted = await employerApi.fetchAcceptedCandidates(userId);
    const tasks = await employerApi.fetchEmployerTasks(userId);
    setPendingTasks(
      (tasks?.data || []).filter((emp) => emp?.status !== "verified")
    );
    setAcceptedCandidates(
      (accepted?.data || []).filter((emp) => emp.finalStatus !== "hired")
    );
  };

  useEffect(() => {
    getCurrentEmployees(userId);
  }, []);

  const hireCandidate = async (id) => {
    await employerApi.setCandidateToHired(id);
    getCurrentEmployees(userId);
  };

  const getPersonalInfo = (candidate) => {
    return (
      candidate?.candidateProfile?.personalInfo ||
      candidate?.candidateId?.personalInfo ||
      {}
    );
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
      <AppBar position="static" color="default" elevation={0}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Current Employees" />
          <Tab label="Accepted Invitation" />
          <Tab label="Task/Requests" />
        </Tabs>
      </AppBar>

      {/* <Box my={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start" /> }}
        />
      </Box> */}

      <TabPanel value={tabIndex} index={0}>
        <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
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
                  <strong>UserName:</strong>{" "}
                  {getPersonalInfo(emp).firstName || emp.username}
                </Typography>
                <Typography variant="body2">
                  <strong>Designation:</strong> {emp?.jobId?.jobTitle}
                </Typography>
              </CardContent>
              <Box>
                <Button
                  variant="outlined"
                  onClick={() => handleViewDetails(emp)}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
          {acceptedCandidates.map((emp, index) => (
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
                  <strong>UserName:</strong>{" "}
                  {getPersonalInfo(emp).firstName || emp.username}
                </Typography>
                <Typography variant="body2">
                  <strong>Designation:</strong> {emp?.jobId?.jobTitle}
                </Typography>
                <Typography variant="body2">
                  <strong>Work Location:</strong> {emp?.jobId?.location}
                </Typography>
              </CardContent>
              <Box>
                <Button
                  onClick={() => hireCandidate(emp?._id)}
                  variant="outlined"
                >
                  Hired
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleViewDetails(emp)}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
          <Stack spacing={3}>
            {pendingTasks.map((emp, index) => (
              <TaskCard
                key={index}
                task={emp}
                getCurrentEmployees={getCurrentEmployees}
                userId={userId}
              />
            ))}
          </Stack>
        </Box>
      </TabPanel>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Candidate Details
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCandidate && (
            <Box>
              <Typography variant="body2" gutterBottom>
                <strong>First Name:</strong>{" "}
                {getPersonalInfo(selectedCandidate).firstName || "N/A"}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Last Name:</strong>{" "}
                {getPersonalInfo(selectedCandidate).lastName || "N/A"}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong>{" "}
                {getPersonalInfo(selectedCandidate).email || "N/A"}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Status:</strong>{" "}
                {getPersonalInfo(selectedCandidate).currentStatus || "Hired"}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Connections;
