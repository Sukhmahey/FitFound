import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
  TextField,
  InputAdornment,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { AppInfoContext } from "../../contexts/AppInfoContext";

const PRIMARY_COLOR = "#062F54";
const ACCENT_COLOR = "#F9A825";

const censorName = (name) => {
  if (!name || name.length < 2) return "-";
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
};

// const CandidateCard = ({
//   data,
//   onViewDetails,
//   onInviteClick,
//   isInvited = false,
// }) => {
//   const firstName = censorName(data?.personalInfo?.firstName ?? "");
//   const lastName = censorName(data?.personalInfo?.lastName ?? "");
//   const fullName = `${firstName} ${lastName}`;

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 2,
//         mb: 3,
//         borderRadius: 4,
//         backgroundColor: "#FAFAFA",
//         border: `1px solid #E0E0E0`,
//         boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//         transition: "0.3s",
//         "&:hover": {
//           boxShadow: "0px 10px 20px rgba(0,0,0,0.06)",
//         },
//       }}
//     >
//       <Stack
//         direction={isMobile ? "column" : "row"}
//         spacing={2}
//         justifyContent="space-between"
//         alignItems={isMobile ? "flex-start" : "center"}
//       >
//         <Stack direction="row" spacing={2} alignItems="center">
//           <Avatar
//             sx={{
//               width: 60,
//               height: 60,
//               bgcolor: PRIMARY_COLOR,
//               fontWeight: 600,
//               fontSize: 16,
//             }}
//           >
//             {data?.score ?? "-"}%
//           </Avatar>

//           <Box>
//             <Typography
//               variant="subtitle1"
//               sx={{ fontWeight: 600, color: PRIMARY_COLOR }}
//             >
//               {fullName}
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{ color: "#666", fontSize: 13, mb: 0.5 }}
//             >
//               {data?.personalInfo?.specialization ?? "-"}
//             </Typography>
//             <Typography variant="body2" sx={{ color: "#999", fontSize: 12 }}>
//               {data?.workHistory?.[0]?.role ?? "-"} •{" "}
//               {data?.basicInfo?.workStatus ?? "-"}
//             </Typography>
//           </Box>
//         </Stack>

//         <Stack
//           direction={isMobile ? "column" : "row"}
//           spacing={1}
//           alignItems={isMobile ? "flex-start" : "flex-end"}
//           mt={isMobile ? 2 : 0}
//           width={isMobile ? "100%" : "auto"}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               color: ACCENT_COLOR,
//               fontWeight: 700,
//               fontSize: 16,
//             }}
//           >
//             ${data?.jobPreference?.salaryExpectation?.min ?? "-"} /hr
//           </Typography>
//           <Stack direction="row" spacing={1}>
//             <Button
//               variant="outlined"
//               size="small"
//               disabled={isInvited}
//               sx={{
//                 color: isInvited ? "#ccc" : PRIMARY_COLOR,
//                 borderColor: isInvited ? "#ccc" : PRIMARY_COLOR,
//                 textTransform: "none",
//                 fontWeight: 500,
//                 borderRadius: "20px",
//                 px: 2,
//               }}
//               onClick={() => onInviteClick(data)}
//             >
//               {isInvited ? "Invited" : "Invite"}
//             </Button>
//             <Button
//               variant="contained"
//               size="small"
//               sx={{
//                 backgroundColor: PRIMARY_COLOR,
//                 color: "#fff",
//                 textTransform: "none",
//                 fontWeight: 500,
//                 borderRadius: "20px",
//                 px: 2,
//                 "&:hover": {
//                   backgroundColor: "#041f39",
//                 },
//               }}
//               onClick={() => onViewDetails(data)}
//             >
//               View Details
//             </Button>
//           </Stack>
//         </Stack>
//       </Stack>
//     </Paper>
//   );
// };

const CandidateCard = ({
  data,
  onViewDetails,
  onInviteClick,
  isInvited = false,
}) => {
  const firstName = censorName(data?.personalInfo?.firstName ?? "");
  const lastName = censorName(data?.personalInfo?.lastName ?? "");
  const fullName = `${firstName} ${lastName}`;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 4,
        backgroundColor: "#FAFAFA",
        border: `1px solid #E0E0E0`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "0.3s",
        "&:hover": {
          boxShadow: "0px 10px 20px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
      >
        {/* Left section */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: PRIMARY_COLOR,
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {data?.score ?? "-"}%
          </Avatar>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: PRIMARY_COLOR }}
            >
              {fullName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontSize: 13, mb: 0.5 }}
            >
              {data?.personalInfo?.specialization ?? "-"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#999", fontSize: 12 }}>
              {data?.workHistory?.[0]?.role ?? "-"} •{" "}
              {data?.basicInfo?.workStatus ?? "-"}
            </Typography>
          </Box>
        </Stack>

        {/* Right section */}
        <Stack
          direction="column"
          spacing={1}
          alignItems={isMobile ? "center" : "flex-end"}
          mt={isMobile ? 2 : 0}
          width={isMobile ? "100%" : "auto"}
        >
          <Typography
            variant="h6"
            sx={{
              color: ACCENT_COLOR,
              fontWeight: 700,
              fontSize: 16,
              alignSelf: isMobile ? "center" : "flex-end",
            }}
          >
            ${data?.jobPreference?.salaryExpectation?.min ?? "-"} /hr
          </Typography>

          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={1}
            alignItems={isMobile ? "center" : "flex-end"}
            width={isMobile ? "100%" : "auto"}
          >
            <Button
              variant="outlined"
              size="small"
              disabled={isInvited}
              sx={{
                color: isInvited ? "#ccc" : PRIMARY_COLOR,
                borderColor: isInvited ? "#ccc" : PRIMARY_COLOR,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: "20px",
                px: 2,
                width: isMobile ? "100%" : "auto",
              }}
              onClick={() => onInviteClick(data)}
            >
              {isInvited ? "Invited" : "Invite"}
            </Button>

            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: PRIMARY_COLOR,
                color: "#fff",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: "20px",
                px: 2,
                width: isMobile ? "100%" : "auto",
                "&:hover": {
                  backgroundColor: "#041f39",
                },
              }}
              onClick={() => onViewDetails(data)}
            >
              View Details
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};
const CandidateDetailsModal = ({ open, handleClose, candidate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!candidate) return null;

  const firstName = censorName(candidate?.personalInfo?.firstName);
  const lastName = censorName(candidate?.personalInfo?.lastName);
  const fullName = `${firstName} ${lastName}`;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent sx={{ p: isMobile ? 2 : 3, position: "relative" }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: PRIMARY_COLOR,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Stack alignItems="center" spacing={1} mb={2}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: PRIMARY_COLOR }}>
            {candidate?.personalInfo?.firstName?.charAt(0)}
          </Avatar>
          <Typography variant="h6" align="center" width="100%">
            {fullName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            width="100%"
          >
            Matching Score: {candidate.score}%
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ color: PRIMARY_COLOR }}>
          Skills
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 1 }}>
          {candidate.skills?.length > 0 ? (
            candidate.skills.map((s) => (
              <Chip
                key={s._id}
                label={s.skill}
                sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                variant="outlined"
              />
            ))
          ) : (
            <Typography variant="body2">No skills listed.</Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ color: PRIMARY_COLOR }}>
          Work History
        </Typography>
        {candidate.workHistory?.length > 0 ? (
          candidate.workHistory.map((job, index) => (
            <Box key={index} sx={{ my: 1 }}>
              <Typography variant="body2">
                <strong>Company:</strong> {job.companyName}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {job.role}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {job.startDate} - {job.endDate}
              </Typography>
              <Typography variant="body2">
                <strong>Experience Level:</strong> {job.experienceLevel}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No work history available.</Typography>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ color: PRIMARY_COLOR }}>
          Education
        </Typography>
        {candidate.education?.length > 0 ? (
          candidate.education.map((edu, index) => (
            <Box key={index} sx={{ my: 1 }}>
              <Typography variant="body2">
                <strong>Institute:</strong> {edu.instituteName}
              </Typography>
              <Typography variant="body2">
                <strong>Credential:</strong> {edu.credentials}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {edu.startDate} - {edu.endDate}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">
            No education history available.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ color: PRIMARY_COLOR }}>
          Job Preferences
        </Typography>
        <Typography variant="body2">
          <strong>Desired Title:</strong>{" "}
          {candidate?.jobPreference?.desiredJobTitle?.join(", ") || "-"}
        </Typography>
        <Typography variant="body2">
          <strong>Job Type:</strong> {candidate?.jobPreference?.jobType || "-"}
        </Typography>
        <Typography variant="body2">
          <strong>Expected Salary:</strong> $
          {candidate?.jobPreference?.salaryExpectation?.min || "-"} / hr
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

const InviteConfirmModal = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ bgcolor: PRIMARY_COLOR, color: "#fff" }}>
      Confirm Invitation
    </DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to send an invitation to this candidate?
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button
        onClick={onClose}
        sx={{ color: PRIMARY_COLOR, textTransform: "none" }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        sx={{ backgroundColor: ACCENT_COLOR, textTransform: "none" }}
        onClick={onConfirm}
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const SearchResults = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchField, setSearchField] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteCandidate, setInviteCandidate] = useState(null);
  const [invitedIds, setInvitedIds] = useState([]);
  const [snackbar, setSnackbar] = useState(false);

  const candidates = useSelector((state) => state.search.candidates);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const userId = user?.profileId;

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Candidate Search" });
  }, []);

  const handleInvite = (candidate) => {
    setInviteCandidate(candidate);
    setInviteDialogOpen(true);
  };

  const confirmInvite = async () => {
    try {
      await employerApi.sendConnectionRequest({
        candidateId: inviteCandidate._id,
        employerId: userId,
        jobId: jobId,
        outreachMessage:
          "Your profile matches our opening. Would you be interested in learning more?",
      });
      setInvitedIds((prev) => [...prev, inviteCandidate._id]);
      setSnackbar(true);
      setInviteDialogOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      <TextField
        sx={{ mb: 2 }}
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Search"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {/* 
      <Box sx={{ maxHeight: "80vh", overflowY: "auto", pr: 1, mt: 2 }}>
        {candidates?.length > 0 ? (
          candidates
            .filter((c) =>
              `${c.personalInfo?.firstName ?? ""} ${
                c.personalInfo?.lastName ?? ""
              }`
                .toLowerCase()
                .includes(searchField.toLowerCase())
            )
            .map((c, index) => (
              <CandidateCard
                key={index}
                data={c}
                onViewDetails={handleViewDetails}
                onInviteClick={handleInvite}
                isInvited={invitedIds.includes(c._id)}
              />
            ))
        ) : (
          <Typography variant="body2">No candidates found.</Typography>
        )}
      </Box> */}

      {candidates?.length > 0 ? (
        candidates
          .filter((c) =>
            `${c.personalInfo?.firstName ?? ""} ${
              c.personalInfo?.lastName ?? ""
            }`
              .toLowerCase()
              .includes(searchField.toLowerCase())
          )
          .map((c, index) => (
            <CandidateCard
              key={index}
              data={c}
              onViewDetails={handleViewDetails}
              onInviteClick={handleInvite}
              isInvited={invitedIds.includes(c._id)}
            />
          ))
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 4,
            mt: 4,
            backgroundColor: "#fefefe",
            border: "1px dashed #ccc",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: PRIMARY_COLOR }}>
            No candidate found with these credentials.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.history.back()}
            sx={{
              mt: 2,
              backgroundColor: PRIMARY_COLOR,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "#041f39",
              },
            }}
          >
            Go Back to Search
          </Button>
        </Paper>
      )}

      <CandidateDetailsModal
        open={modalOpen}
        handleClose={handleClose}
        candidate={selectedCandidate}
      />

      <InviteConfirmModal
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        onConfirm={confirmInvite}
      />

      <Snackbar
        open={snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Invitation sent successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchResults;
