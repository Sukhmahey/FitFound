import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Avatar,
  Divider,
  useMediaQuery,
  Switch,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  const handleToggleNotification = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your profile and security preferences
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: "#0E3A62", width: 56, height: 56 }}>
            <AccountCircleRoundedIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {role === "employer" ? employerName : candidateName}
            </Typography>
            
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={currentUserEmail || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value="********"
                disabled
              />
              <Button
                onClick={() => setOpen(true)}
                size="small"
                sx={{ mt: 1, textTransform: "none", fontWeight: 500 }}
              >
                Change Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {role === "candidate" && (
        <Box mb={4}>
          <SubscriptionSelector />
        </Box>
      )}

      <Box mb={4}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
          Notifications
        </Typography>
        <Card
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">Receive updates and alerts</Typography>
          <Switch
            size="small"
            checked={notificationsEnabled}
            onChange={handleToggleNotification}
          />
        </Card>
      </Box>

      <Box textAlign="center">
        <Button
          variant="outlined"
          color="error"
          sx={{ borderRadius: 2, px: 4, py: 1.2, fontWeight: 600 }}
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
            <DialogActions sx={{ mt: 2 }}>
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
