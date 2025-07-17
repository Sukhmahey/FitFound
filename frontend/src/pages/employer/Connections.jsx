import React, { useEffect, useState, useContext } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
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
  TextField,
  InputAdornment,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { AppInfoContext } from "../../contexts/AppInfoContext";

const primaryColor = "#0E3A62";

const TabPanel = ({ children, value, index }) =>
  value === index ? <Box pt={2}>{children}</Box> : null;

const TaskCard = ({ task, getCurrentEmployees, userId, onViewDetails }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleVerifyClick = () => setConfirmOpen(true);
  const handleConfirm = async () => {
    await employerApi.verifyTask(task?._id);
    getCurrentEmployees(userId);
    setConfirmOpen(false);
  };
  const handleCancel = () => setConfirmOpen(false);
  const personal = task?.candidateId?.personalInfo || {};

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      variant="outlined"
      sx={{ mb: 3, p: 2, fontFamily: "Montserrat, sans-serif" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          backgroundColor: "#F0F4F8",
          borderRadius: 2,
          p: 2,
          gap: 2,
        }}
      >
        <Avatar sx={{ width: 64, height: 64 }} />
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: primaryColor }}
          >
            {personal.firstName} {personal.lastName}
          </Typography>
          <Typography variant="body2">
            Email: {personal.email || "N/A"}
          </Typography>
          <Typography variant="body2">
            Role: {task?.position || "N/A"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: primaryColor }}
        >
          Work Authorization Badge
        </Typography>
        <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 2 }}>
          <Typography>
            From {task?.employmentDates?.startDate} To{" "}
            {task?.employmentDates?.endDate || "Current"}
          </Typography>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={1}
            mt={2}
            alignItems={isMobile ? "center" : "flex-start"}
          >
            <Button
              onClick={handleVerifyClick}
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                color: "#fff",
                fontFamily: "Montserrat, sans-serif",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#041f39",
                },
              }}
            >
              Verify
            </Button>
            <Button
              onClick={() => onViewDetails(task)}
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                color: "#fff",
                fontFamily: "Montserrat, sans-serif",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#041f39",
                },
              }}
            >
              View Details
            </Button>
          </Stack>
        </Box>
      </Box>

      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle sx={{ fontFamily: "Montserrat, sans-serif" }}>
          Confirm Verification
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "Montserrat, sans-serif" }}>
            Are you sure you want to verify this candidate?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{ backgroundColor: primaryColor }}
          >
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { user } = useAuth();
  const { setAppGeneralInfo } = useContext(AppInfoContext);
  const userId = user?.profileId;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Connections" });
    getCurrentEmployees(userId);
  }, []);

  const handleTabChange = (e, newValue) => setTabIndex(newValue);
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
    const accepted = await employerApi.fetchAcceptedCandidates(userId);
    const tasks = await employerApi.fetchEmployerTasks(userId);

    setCurrentEmployee(employeeData?.data || []);
    setAcceptedCandidates(
      (accepted?.data || []).filter((emp) => emp.finalStatus !== "hired")
    );
    setPendingTasks(
      (tasks?.data || []).filter((emp) => emp?.status !== "verified")
    );
  };

  const hireCandidate = async (id) => {
    await employerApi.setCandidateToHired(id);
    getCurrentEmployees(userId);
  };

  const getPersonalInfo = (candidate) =>
    candidate?.candidateProfile?.personalInfo ||
    candidate?.candidateId?.personalInfo ||
    {};

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontFamily: "Montserrat, sans-serif",
          color: primaryColor,
          mb: 3,
        }}
      >
        Connections
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{
          mb: 2,
          ".MuiTab-root": {
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            textTransform: "none",
            color: "#333",
            minWidth: isMobile ? "100%" : "auto",
          },
          ".Mui-selected": {
            color: primaryColor + " !important",
          },
          ".MuiTabs-indicator": {
            backgroundColor: primaryColor,
          },
        }}
      >
        <Tab label="Current Employees" />
        <Tab label="Accepted Invitations" />
        <Tab label="Tasks / Requests" />
      </Tabs>

      <TextField
        variant="outlined"
        fullWidth
        size="small"
        placeholder="Search by name or designation..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3, fontFamily: "Montserrat, sans-serif" }}
      />

      <TabPanel value={tabIndex} index={0}>
        {currentEmployee.map((emp, index) => {
          const info = getPersonalInfo(emp);
          return (
            <Card
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}
            >
              <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
              <CardContent sx={{ flexGrow: 1, p: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color={primaryColor}
                >
                  {info.firstName || emp.username}
                </Typography>
                <Typography variant="body2">
                  Designation: {emp?.jobId?.jobTitle}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: primaryColor,
                  color: "#fff",
                  fontFamily: "Montserrat, sans-serif",
                  textTransform: "none",
                }}
                onClick={() => handleViewDetails(emp)}
              >
                View Details
              </Button>
            </Card>
          );
        })}
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        {acceptedCandidates.map((emp, index) => {
          const info = getPersonalInfo(emp);
          return (
            <Card
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}
            >
              <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
              <CardContent sx={{ flexGrow: 1, p: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color={primaryColor}
                >
                  {info.firstName || emp.username}
                </Typography>
                <Typography variant="body2">
                  Designation: {emp?.jobId?.jobTitle}
                </Typography>
                <Typography variant="body2">
                  Work Location: {emp?.jobId?.location}
                </Typography>
              </CardContent>
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: primaryColor,
                    color: "#fff",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                  onClick={() => hireCandidate(emp?._id)}
                >
                  Hire
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: primaryColor,
                    color: "#fff",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                  onClick={() => handleViewDetails(emp)}
                >
                  View Details
                </Button>
              </Stack>
            </Card>
          );
        })}
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
          <Stack spacing={3}>
            {pendingTasks.map((emp, index) => (
              <TaskCard
                key={index}
                task={emp}
                userId={userId}
                getCurrentEmployees={getCurrentEmployees}
                onViewDetails={handleViewDetails}
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
        <DialogTitle
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            color: primaryColor,
            bgcolor: "#EDF9FF",
          }}
        >
          Candidate Details
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCandidate && (
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      color: primaryColor,
                    }}
                  >
                    {getPersonalInfo(selectedCandidate).firstName}{" "}
                    {getPersonalInfo(selectedCandidate).lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedCandidate?.jobId?.jobTitle || "N/A"}
                  </Typography>
                </Box>
              </Stack>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: primaryColor,
                  }}
                >
                  📞 Contact Info
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong>{" "}
                  {getPersonalInfo(selectedCandidate).email || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong>{" "}
                  {getPersonalInfo(selectedCandidate).currentStatus || "Hired"}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Connections;
