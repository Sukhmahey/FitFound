import React, { useEffect, useState, useContext } from "react";
import {
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

const Connections = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [currentEmployee, setCurrentEmployee] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalSource, setModalSource] = useState("");
  const [showHireConfirm, setShowHireConfirm] = useState(false);
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

  const handleViewDetails = (candidate, source = "") => {
    setSelectedCandidate(candidate);
    setModalSource(source);
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

  const hireCandidate = async () => {
    await employerApi.setCandidateToHired(selectedCandidate?._id);
    setShowHireConfirm(false);
    getCurrentEmployees(userId);
  };

  const getPersonalInfo = (candidate) =>
    candidate?.candidateProfile?.personalInfo ||
    candidate?.candidateId?.personalInfo ||
    {};

  const getBasicInfo = (candidate) =>
    candidate?.candidateProfile?.basicInfo || {};

  const getJobPref = (candidate) =>
    candidate?.candidateProfile?.jobPreference || {};

  const getSkills = (candidate) => candidate?.candidateProfile?.skills || [];

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
        orientation="horizontal"
        allowScrollButtonsMobile
        sx={{
          mb: 2,
          maxWidth: "100%",
          overflowX: "auto",
          "& .MuiTabs-flexContainer": {
            flexWrap: "nowrap",
          },
          "& .MuiTab-root": {
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            textTransform: "none",
            color: "#333",
            whiteSpace: "nowrap",
            minWidth: 120,
          },
          "& .Mui-selected": {
            color: primaryColor + " !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: primaryColor,
          },
        }}
      >
        <Tab label={isMobile ? "Employees" : "Current Employees"} />
        <Tab label={isMobile ? "Invites" : "Accepted Invitations"} />
        <Tab label={isMobile ? "Tasks" : "Tasks / Requests"} />
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
                  {info.firstName} {info.lastName}
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
                onClick={() => handleViewDetails(emp, "current")}
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
                  {info.firstName} {info.lastName}
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
                  onClick={() => {
                    setSelectedCandidate(emp);
                    setShowHireConfirm(true);
                  }}
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
                  onClick={() => handleViewDetails(emp, "accepted")}
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
            {pendingTasks.map((task, index) => {
              const info = getPersonalInfo(task);
              return (
                <Card key={index} sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 56, height: 56 }} />
                    <Box>
                      <Typography fontWeight={600} color={primaryColor}>
                        {info.firstName} {info.lastName}
                      </Typography>
                      <Typography variant="body2">
                        Email: {info.email}
                      </Typography>
                      <Typography variant="body2">
                        Role: {task?.position}
                      </Typography>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="body2">
                      From: {task?.employmentDates?.startDate} To:{" "}
                      {task?.employmentDates?.endDate}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={2}>
                      <Button
                        variant="contained"
                        onClick={() => {
                          employerApi
                            .verifyTask(task._id)
                            .then(() => getCurrentEmployees(userId));
                        }}
                        sx={{ backgroundColor: primaryColor, color: "#fff" }}
                      >
                        Verify
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleViewDetails(task, "task")}
                        sx={{ backgroundColor: primaryColor, color: "#fff" }}
                      >
                        View Details
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              );
            })}
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
                    {selectedCandidate?.jobId?.jobTitle ||
                      selectedCandidate?.position ||
                      "N/A"}
                  </Typography>
                </Box>
              </Stack>

              {modalSource === "accepted" && (
                <>
                  <Typography variant="body2">
                    <strong>Email:</strong>{" "}
                    {getPersonalInfo(selectedCandidate).email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong>{" "}
                    {getPersonalInfo(selectedCandidate).currentStatus}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong>{" "}
                    {getBasicInfo(selectedCandidate).phoneNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Work Status:</strong>{" "}
                    {getBasicInfo(selectedCandidate).workStatus}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Desired Title:</strong>{" "}
                    {getJobPref(selectedCandidate).desiredJobTitle?.join(", ")}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Job Type:</strong>{" "}
                    {getJobPref(selectedCandidate).jobType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Skills:</strong>{" "}
                    {getSkills(selectedCandidate)
                      .map((s) => s.skill)
                      .join(", ")}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Bio:</strong> {getBasicInfo(selectedCandidate).bio}
                  </Typography>
                </>
              )}

              {modalSource === "task" && (
                <>
                  <Typography variant="body2">
                    <strong>Email:</strong>{" "}
                    {getPersonalInfo(selectedCandidate).email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Role:</strong> {selectedCandidate?.position}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Employment:</strong>{" "}
                    {selectedCandidate?.employmentDates?.startDate} -{" "}
                    {selectedCandidate?.employmentDates?.endDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {selectedCandidate?.status}
                  </Typography>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showHireConfirm} onClose={() => setShowHireConfirm(false)}>
        <DialogTitle>Confirm Hiring</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this candidate as hired?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHireConfirm(false)}>Cancel</Button>
          <Button
            onClick={hireCandidate}
            variant="contained"
            sx={{ backgroundColor: primaryColor }}
          >
            Yes, Hire
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Connections;
