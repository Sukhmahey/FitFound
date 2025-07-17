import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Container,
  Paper,
  Chip,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

import { candidateApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { AppInfoContext } from "../../contexts/AppInfoContext";

const primaryColor = "#0E3A62";

const TabPanel = ({ children, value, index }) =>
  value === index ? <Box pt={2}>{children}</Box> : null;

const Connections = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [archived, setArchived] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);

  const { user } = useAuth();
  const userId = user?.profileId;
  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Connections" });
    fetchConnections();
  }, []);

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  const fetchConnections = async () => {
    const res = await candidateApi.fetchInteractions(userId);
    const data = res.data || [];

    setPending(
      data.filter(
        (c) => !c.candidateConsentToReveal && c.finalStatus !== "rejected"
      )
    );
    setAccepted(
      data.filter(
        (c) => c.candidateConsentToReveal === true || c.finalStatus === "hired"
      )
    );
    setArchived(data.filter((c) => c.finalStatus === "rejected"));
  };

  const handleViewDetails = (employer) => {
    setSelectedEmployer(employer);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployer(null);
  };

  const acceptInvitation = async (id) => {
    await candidateApi.acceptInvitation(id);
    fetchConnections();
  };

  const declineInvitation = async (id) => {
    await candidateApi.declineInvitation(id);
    fetchConnections();
  };

  const filterBySearch = (list) => {
    const keyword = search.toLowerCase();
    return list.filter((emp) => {
      const company = emp?.employerId?.companyName?.toLowerCase() || "";
      const name = emp?.employerId?.contactInfo?.firstName?.toLowerCase() || "";
      const designation =
        emp?.employerId?.contactInfo?.designation?.toLowerCase() || "";
      return (
        company.includes(keyword) ||
        name.includes(keyword) ||
        designation.includes(keyword)
      );
    });
  };

  const renderCards = (list, showAcceptDecline = false) =>
    filterBySearch(list).map((emp, idx) => {
      const company = emp?.employerId?.companyName;
      const contact = emp?.employerId?.contactInfo?.firstName;
      const designation = emp?.employerId?.contactInfo?.designation;
      const status =
        emp?.finalStatus === "rejected"
          ? "Archived"
          : emp?.candidateConsentToReveal
          ? "Accepted"
          : "Pending";

      return (
        <Paper
          key={idx}
          elevation={0}
          sx={{
            border: "1px solid #E0E0E0",
            borderRadius: 2,
            p: 2,
            mb: 2,
            bgcolor: "#fff",
            transition: "0.2s",
            "&:hover": { boxShadow: 2 },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: primaryColor,
              }}
            >
              #{emp._id?.slice(0, 6)} – {company}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={status}
                sx={{
                  textTransform: "capitalize",
                  fontWeight: 500,
                  bgcolor:
                    status === "Pending"
                      ? "#E3F2FD"
                      : status === "Accepted"
                      ? "#E8F5E9"
                      : "#F5F5F5",
                  color:
                    status === "Pending"
                      ? "#1976D2"
                      : status === "Accepted"
                      ? "#388E3C"
                      : "#666",
                }}
              />
              <Avatar
                src={emp?.employerId?.contactInfo?.profilePicture}
                sx={{ width: 28, height: 28 }}
              />
            </Stack>
          </Box>

          <Box mt={1}>
            <Typography
              variant="body2"
              sx={{ fontFamily: "Figtree, sans-serif", color: "#444" }}
            >
              👔 {designation} 👤 {contact}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} mt={2}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleViewDetails(emp.employerId)}
            >
              View Details
            </Button>
            {showAcceptDecline && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => acceptInvitation(emp._id)}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => declineInvitation(emp._id)}
                >
                  Decline
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      );
    });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          color: primaryColor,
          mb: 3,
        }}
      >
        Your Connections
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          ".MuiTab-root": {
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            textTransform: "none",
            color: "#333",
          },
          ".Mui-selected": {
            color: primaryColor + " !important",
          },
          ".MuiTabs-indicator": {
            backgroundColor: primaryColor,
          },
        }}
      >
        <Tab label="Pending" />
        <Tab label="Accepted" />
        <Tab label="Archived" />
      </Tabs>

      <Box mb={2}>
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          placeholder="Search by company or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TabPanel value={tabIndex} index={0}>
        {renderCards(pending, true)}
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        {renderCards(accepted)}
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        {renderCards(archived)}
      </TabPanel>

      {/* Shared Modal */}
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
            borderBottom: "1px solid #ccc",
          }}
        >
          Employer Details
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ fontFamily: "Figtree, sans-serif" }}>
          {selectedEmployer && (
            <Stack spacing={3}>
              {/* Header */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={selectedEmployer?.contactInfo?.profilePicture}
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      color: primaryColor,
                    }}
                  >
                    {selectedEmployer?.companyName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEmployer?.contactInfo?.designation}
                  </Typography>
                </Box>
              </Stack>

              {/* Contact Info */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: primaryColor,
                    fontFamily: "Montserrat, sans-serif",
                    mb: 1,
                  }}
                >
                  📞 Contact Information
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Name:</strong>{" "}
                    {selectedEmployer?.contactInfo?.firstName}{" "}
                    {selectedEmployer?.contactInfo?.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong>{" "}
                    {selectedEmployer?.contactInfo?.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong>{" "}
                    {selectedEmployer?.contactInfo?.phone}
                  </Typography>
                </Stack>
              </Box>

              {/* Company Info */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: primaryColor,
                    fontFamily: "Montserrat, sans-serif",
                    mb: 1,
                  }}
                >
                  🏢 Company Info
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Description:</strong>{" "}
                    {selectedEmployer?.companyDescription || "Not Provided"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Additional Info:</strong>{" "}
                    {selectedEmployer?.contactInfo?.additionalDetails || "—"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Connections;
