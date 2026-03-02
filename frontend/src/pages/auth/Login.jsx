import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../../services/firebase";
import { userApi, loginApi, employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

import logo from "../../assets/logo-blue.svg";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();

  const isMobile = useMediaQuery("(max-width:600px)");
  const [role, setRole] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

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
          loginApi
            .loginUser({ idToken })
            .then((res) =>
              userApi.getUserByEmail({ email: res.data.decodedidToken.email })
            )
        )
        .then((res) => {
          if (res.data.userId) {
            login(res.data);
            localStorage.setItem("userId", res.data.userId);
            handleNavigate(res.data.role, res.data.userId);
          } else {
            setResponseMessage("User login failed");
          }
        })
        .catch((err) => {
          console.error("Login error:", err);
          setResponseMessage("Incorrect credentials or user not found");
        });
    });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => result.user.getIdToken())
      .then((idToken) => loginApi.loginUser({ idToken }))
      .then((res) =>
        userApi
          .getUserByEmail({ email: res.data.decodedidToken.email })
          .then((result) => {
            if (!result.data.userId) {
              const newUser = {
                role,
                email: res.data.decodedidToken.email,
                idFirebaseUser: res.data.decodedidToken.uid,
              };

              return userApi.addUser(newUser).then((newRes) => {
                login(newRes.data);
                navigate(
                  newRes.data.role === "candidate"
                    ? "/candidate/dashboard"
                    : "/employer/dashboard"
                );
              });
            } else {
              login(result.data);
              navigate(
                result.data.role === "candidate"
                  ? "/candidate/dashboard"
                  : "/employer/dashboard"
              );
            }
          })
      )
      .catch((err) => {
        console.error("Google login error:", err);
      });
  };

  const handleGuestLogin = () => {
    // Simple guest flow: mark as guest and go to employer dashboard
    loginAsGuest();
    navigate("/employer/dashboard");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: "Figtree, sans-serif",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          position: isMobile ? "static" : "absolute",
          top: 20,
          left: 20,
          display: isMobile ? "none" : "block",
        }}
      >
        <Box sx={{ width: 120 }}>
          <img src={logo} alt="FitFound Logo" style={{ height: 40 }} />
        </Box>
      </Box>

      {/* Form Section */}
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
            Login to your account
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button
              fullWidth
              variant={role === "candidate" ? "contained" : "outlined"}
              onClick={() => setRole("candidate")}
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
              fullWidth
              variant={role === "employer" ? "contained" : "outlined"}
              onClick={() => setRole("employer")}
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
              type="email"
              label="Email"
              fullWidth
              variant="outlined"
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              type="password"
              label="Password"
              fullWidth
              variant="outlined"
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#0E3A62",
                borderRadius: "12px",
                textTransform: "none",
                py: 1.2,
              }}
            >
              Login
            </Button>
          </form>

          <Typography
            variant="body2"
            onClick={() => navigate("/recover-password")}
            sx={{
              mt: 1.5,
              textAlign: "right",
              color: "#0E3A62",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Forgot your password?
          </Typography>

          {role === 'candidate' && (
            <>
              <Box sx={{ my: 2, textAlign: "center", color: "#888" }}>or</Box>
              <Button
                fullWidth
                onClick={handleGoogleLogin}
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Continue with Google
              </Button>
            </>
           )}
          <Box sx={{ my: 2, textAlign: "center", color: "#888" }}>or</Box>
          <Button
            fullWidth
            onClick={handleGuestLogin}
            variant="text"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "#0E3A62",
            }}
          >
            Continue as Guest
          </Button>
          {responseMessage && (
            <Typography
              variant="body2"
              sx={{ mt: 2, color: "red", textAlign: "center" }}
            >
              {responseMessage}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            New here?{" "}
            <span style={{ color: "#0E3A62", fontWeight: 600 }}>
              Create an account
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
          Welcome to FitFound
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: 400,
            textAlign: "center",
            fontFamily: "Figtree, sans-serif",
          }}
        >
          Your smarter path to finding opportunities and the right candidates.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
