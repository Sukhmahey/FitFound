import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import { userApi, loginApi, employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  useMediaQuery,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:1024px)");

  const handleNavigate = (role, userId) => {
    if (role === "employer") {
      employerApi
        .getEmployerProfile(userId)
        .then(() => navigate("/employer/dashboard"))
        .catch(() => navigate("/employer/onboarding"));
    } else {
      navigate("/candidate/dashboard");
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => result.user.getIdToken())
        .then((idToken) =>
          loginApi.loginUser({ idToken }).then((res) =>
            userApi
              .getUserByEmail({ email: res.data.decodedidToken.email })
              .then((result) => {
                if (result.data.userId) {
                  login(result.data);
                  localStorage.setItem("userId", result.data.userId);
                  handleNavigate(result.data.role, result.data.userId);
                }
              })
          )
        )
        .catch((error) => console.error("Login Error:", error));
    });
  };

  const handleForgotPassword = () => navigate("/forgot-password");
  const handleSignupClick = () => navigate("/signup");

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: "Figtree, sans-serif",
      }}
    >
      {/* Left Panel (Logo for desktop) */}
      <Box
        sx={{
          position: isMobile ? "static" : "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          display: isMobile ? "none" : "block",
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 40,
            bgcolor: "#ccc",
            borderRadius: "8px",
            textAlign: "center",
            lineHeight: "40px",
            fontWeight: 600,
          }}
        >
          LOGO
        </Box>
      </Box>

      {/* Form Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          py: isMobile ? 4 : 8,
          px: isMobile ? 2 : 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{ width: "100%", maxWidth: 400, p: isMobile ? 2 : 4 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              mb: 2,
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Log in to your account
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button
              onClick={() => setRole("candidate")}
              fullWidth
              variant={role === "candidate" ? "contained" : "outlined"}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                bgcolor: role === "candidate" ? "#0E3A62" : "white",
                color: role === "candidate" ? "white" : "#0E3A62",
              }}
            >
              Candidate
            </Button>
            <Button
              onClick={() => setRole("employer")}
              fullWidth
              variant={role === "employer" ? "contained" : "outlined"}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                bgcolor: role === "employer" ? "#0E3A62" : "white",
                color: role === "employer" ? "white" : "#0E3A62",
              }}
            >
              Employer
            </Button>
          </Box>

          <form onSubmit={handleEmailLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                onClick={handleForgotPassword}
                sx={{
                  textTransform: "none",
                  fontSize: "13px",
                  color: "#0E3A62",
                }}
              >
                Forgot password?
              </Button>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#0E3A62",
                borderRadius: "12px",
                textTransform: "none",
                py: 1.2,
              }}
            >
              Log in
            </Button>
          </form>

          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", cursor: "pointer" }}
            onClick={handleSignupClick}
          >
            New here?{" "}
            <span style={{ color: "#0E3A62", fontWeight: 600 }}>
              Create an Account
            </span>
          </Typography>
        </Paper>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#0E3A62",
          color: "white",
          display: isMobile ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Very simple way you can engage
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: 400,
            textAlign: "center",
            fontFamily: "Figtree, sans-serif",
          }}
        >
          Welcome to DAILY Inventory Management System! Efficiently track and
          manage your inventory with ease.
        </Typography>
        {/* Optionally add graphs or images */}
      </Box>
    </Box>
  );
};

export default Login;
