import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "../../services/firebase";
import { userApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  useMediaQuery,
} from "@mui/material";

import logo from "../../assets/logo-blue.svg";

const Signup = () => {
  const [role, setRole] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSignUpClick = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setResponseMessage("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;

        const userPayload = {
          email: firebaseUser.email,
          idFirebaseUser: firebaseUser.uid,
          role,
        };

        if (role === "employer") {
          userPayload.companyName = companyName;
          userPayload.companyDescription = companyDescription;
        }

        return userApi
          .addUser(userPayload)
          .then((result) => {
            login(result.data);
            setResponseMessage("User registered successfully");
            localStorage.setItem("userId", firebaseUser.uid);
            navigate(
              role === "candidate"
                ? "/candidate/onboarding"
                : "/employer/onboarding"
            );
          })
          .catch(async (error) => {
            await deleteUser(firebaseUser);
            console.error("MongoDB error, Firebase user deleted", error);
            setResponseMessage("User creation failed. Check required fields.");
          });
      })
      .catch((error) => {
        console.error("Firebase error", error);
        setResponseMessage("User creation failed");
      });
  };

  const handleRoleClick = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
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
      {/* Logo for Desktop */}
      <Box
        sx={{
          position: isMobile ? "static" : "absolute",
          top: 20,
          left: 20,
          display: isMobile ? "none" : "block",
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 40,
            borderRadius: "8px",
            textAlign: "center",
            lineHeight: "40px",
            fontWeight: 600,
          }}
        >
          <img
            src={logo}
            alt="FitFound Logo"
            style={{ height: "40px", color: "blue" }}
          />
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
            Create your account
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button
              onClick={() => handleRoleClick("candidate")}
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
              onClick={() => handleRoleClick("employer")}
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

          <form onSubmit={handleSignUpClick}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="dense"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* {role === "employer" && (
              <>
                <TextField
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <TextField
                  label="Company Description"
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  multiline
                  rows={3}
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  required
                />
              </>
            )} */}

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
              Sign up
            </Button>
          </form>

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
            onClick={handleLoginRedirect}
          >
            Already have an account?{" "}
            <span style={{ color: "#0E3A62", fontWeight: 600 }}>Log in</span>
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
          Join the smarter way to get hired
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxWidth: 400,
            textAlign: "center",
            fontFamily: "Figtree, sans-serif",
          }}
        >
          FitFound helps you connect with employers or find the right candidates
          efficiently.
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
