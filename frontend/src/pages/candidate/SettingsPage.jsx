import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { candidateApi, employerApi } from "../../services/api";
import { auth } from "../../services/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import SubscriptionSelector from "./settingsComponents/SubscriptionSelector";
import NotificationPermission from "./settingsComponents/NotificationPermission";

export default function SettingsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user, logout } = useAuth();
  const userId = user?.userId;
  const navigate = useNavigate();

  const [role, setRole] = useState(user?.role);
  const [candidateName, setCandidateName] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setRole(user?.role);
    setCurrentUserEmail(user?.email);

    if (user?.role === "candidate" && userId) {
      candidateApi
        .getProfileByUserId(userId)
        .then((res) => setCandidateName(res.data.personalInfo.firstName))
        .catch((err) => console.error("Candidate fetch error:", err));
    } else if (user?.role === "employer") {
      employerApi
        .getEmployerProfile(userId)
        .then((res) => setEmployerName(res.data.companyName))
        .catch((err) => console.error("Employer fetch error:", err));
    }
  }, [userId]);

  const handlePasswordReset = async () => {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      oldPassword
    );
    try {
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      console.log("Password updated");
      handleClose();
    } catch (error) {
      console.error("Password update failed:", error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePasswordReset();
  };

  const handleClose = () => setOpen(false);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        sx={{ mb: 4, fontFamily: "Montserrat, sans-serif" }}
      >
        Settings
      </Typography>

      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          p: 2,
          borderRadius: 3,
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "#062F54",
            mr: 2,
          }}
        >
          <AccountCircleRoundedIcon fontSize="large" />
        </Avatar>
        <CardContent>
          <Typography variant="h6" fontWeight={600}>
            {role === "employer" ? employerName : candidateName}
          </Typography>
          <Typography variant="body2">{currentUserEmail}</Typography>
        </CardContent>
      </Card>

      <Box mb={4}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Account Security
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              fullWidth
              size="small"
              value={currentUserEmail || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              fullWidth
              size="small"
              value="********"
              type="password"
              disabled
            />
            <Button onClick={() => setOpen(true)} sx={{ mt: 1 }}>
              Reset Password
            </Button>
          </Grid>
        </Grid>
      </Box>

      {role === "candidate" && (
        <Box mb={4}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Subscriptions
          </Typography>
          <SubscriptionSelector />
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Notifications
        </Typography>
        <NotificationPermission />
      </Box>

      <Box mb={6}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Help
        </Typography>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Need help?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Reach out to us and get the support you need.
          </Typography>
          <Button variant="contained" sx={{ backgroundColor: "#062F54" }}>
            Contact Us
          </Button>
        </Card>
      </Box>

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="error"
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 3,
            textTransform: "none",
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={700}>Reset Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogContentText sx={{ mb: 2 }}>
              Enter your old and new password to reset.
            </DialogContentText>
            <TextField
              fullWidth
              margin="dense"
              label="Old Password"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              fullWidth
              margin="dense"
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <DialogActions sx={{ mt: 1 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Confirm
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
