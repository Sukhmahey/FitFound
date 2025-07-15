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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { candidateApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { AppInfoContext } from "../../contexts/AppInfoContext";

const TabPanel = ({ children, value, index }) => {
  return value === index ? <Box p={2}>{children}</Box> : null;
};

const Connections = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [archived, setArchived] = useState([]);

  const [openModal, setOpenModal] = useState(false); // NEW: State to control modal visibility
  const [selectedEmployer, setSelectedEmployer] = useState(null); // NEW: State to store selected employer data

  const { user } = useAuth();
  const userId = user?.profileId;

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Connections" });
  }, []);

  const handleTabChange = (e, newValue) => {
    setTabIndex(newValue);
  };

  const handleViewDetails = (employer) => {
    // NEW: Function to handle opening modal
    setSelectedEmployer(employer);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    // NEW: Function to handle closing modal
    setOpenModal(false);
    setSelectedEmployer(null);
  };

  const filterBySearch = (data) => {
  return data.filter((emp) => {
    const companyName = emp?.employerId?.companyName?.toLowerCase() || "";
    const firstName = emp?.employerId?.contactInfo?.firstName?.toLowerCase() || "";
    const designation = emp?.employerId?.contactInfo?.designation?.toLowerCase() || "";
    const keyword = search.toLowerCase();

    return (
      companyName.includes(keyword) ||
      firstName.includes(keyword) ||
      designation.includes(keyword)
    );
  });
};

  const getCurrentEmployees = async (userId) => {
    const candidateData = await candidateApi.fetchInteractions(userId);

    setPending(
      (candidateData?.data || []).filter(
        (candidate) =>
          !candidate?.candidateConsentToReveal &&
          candidate?.finalStatus !== "rejected"
      )
    );

    setAccepted(
      (candidateData?.data || []).filter(
        (candidate) =>
          candidate?.candidateConsentToReveal &&
          candidate?.finalStatus === "hired"
      )
    );

    setArchived(
      (candidateData?.data || []).filter(
        (candidate) => candidate?.finalStatus === "rejected"
      )
    );
  };

  const acceptInvitation = async (id) => {
    await candidateApi.acceptInvitation(id).then(() => {
      getCurrentEmployees(userId);
    });
  };

  const declineInvitation = async (id) => {
    await candidateApi.declineInvitation(id).then(() => {
      getCurrentEmployees(userId);
    });
  };

  useEffect(() => {
    getCurrentEmployees(userId);
  }, []);

  const renderCards = (data, showAcceptDecline = false) =>
    data.map((emp, index) => (
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
        <Avatar
          src={emp?.employerId?.contactInfo?.profilePicture}
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <CardContent sx={{ flexGrow: 1, p: 0 }}>
          <Typography variant="subtitle1">
            <strong>UserName:</strong> {emp?.employerId?.companyName}
          </Typography>
          <Typography variant="body2">
            <strong>Designation:</strong>{" "}
            {emp?.employerId?.contactInfo?.designation}
          </Typography>
          <Typography variant="body2">
            <strong>Sent By:</strong> {emp?.employerId?.contactInfo?.firstName}
          </Typography>
        </CardContent>
        <Box>
          <Button
            variant="outlined"
            onClick={() => handleViewDetails(emp?.employerId)}
          >
            View Details
          </Button>
          {showAcceptDecline && (
            <>
              <Button
                variant="outlined"
                onClick={() => acceptInvitation(emp._id)}
                sx={{ ml: 1 }}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                onClick={() => declineInvitation(emp._id)}
                sx={{ ml: 1 }}
              >
                Decline
              </Button>
            </>
          )}
        </Box>
      </Card>
    ));

  return (
    <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
      <AppBar position="static" color="default" elevation={0}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Pending" />
          <Tab label="Accepted" />
          <Tab label="Archived" />
        </Tabs>
      </AppBar>

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
                {/* Icon placeholder if needed */}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TabPanel value={tabIndex} index={0}>
        <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
          {/* {renderCards(pending, true)} */}
          {renderCards(filterBySearch(pending), true)}
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
          {/* {renderCards(accepted)} */}
          {renderCards(filterBySearch(accepted))}
        </Box>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Box sx={{ maxHeight: "70vh", overflowY: "auto", pr: 1 }}>
          {/* {renderCards(archived)} */}
          {renderCards(filterBySearch(archived))}
        </Box>
      </TabPanel>

      {/* NEW: Modal to display employer details */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Employer Details
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEmployer && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  src={selectedEmployer?.contactInfo?.profilePicture}
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
                <Typography variant="h6">
                  {selectedEmployer?.companyName}
                </Typography>
              </Box>
              <Typography variant="body2" gutterBottom>
                <strong>Designation:</strong>{" "}
                {selectedEmployer?.contactInfo?.designation}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Contact:</strong>{" "}
                {selectedEmployer?.contactInfo?.firstName}{" "}
                {selectedEmployer?.contactInfo?.lastName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> {selectedEmployer?.contactInfo?.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Phone:</strong> {selectedEmployer?.contactInfo?.phone}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Description:</strong>{" "}
                {selectedEmployer?.companyDescription}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Additional Info:</strong>{" "}
                {selectedEmployer?.contactInfo?.additionalDetails}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Connections;
