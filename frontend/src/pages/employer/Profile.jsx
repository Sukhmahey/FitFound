import { useEffect, useState, useContext } from "react";
import { Box, Typography, Tabs, Tab, Button, Paper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { AppInfoContext } from "../../contexts/AppInfoContext";
import CompanyInfo from "./onboardingSteps/CompanyInfo";
import UserContactInfo from "./onboardingSteps/UserContactInfo";
import useNotify from "../../utils/notificationService";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const EmployerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const methods = useForm();
  const notify = useNotify();
  const [formSection, setFormSection] = useState(0);
  const [companyInfo, setCompanyInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
const [snackMessage, setSnackMessage] = useState("");
const [snackSeverity, setSnackSeverity] = useState("error");

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "My Profile" });
  }, [setAppGeneralInfo]);

  const validateForm = (data) => {
  const errors = [];

  if (formSection === 0) {
    if (!data.companyName?.trim()) errors.push("Company name is required");
    if (!data.establishedYear || data.establishedYear < 1900 || data.establishedYear > new Date().getFullYear()) {
      errors.push("Established year must be between 1900 and the current year");
    }
    if (!data.businessRegisteredNumber?.trim()) errors.push("Business Reg. Number is required");
    if (!data.industrySector?.trim()) errors.push("Industry sector is required");
    if (!data.companySize?.trim()) errors.push("Company size is required");
    if (!data.workLocation?.trim()) errors.push("Work location is required");
    if (!data.companyWebsite?.trim()) errors.push("Company website is required");
    if (!data.companyDescription?.trim() || data.companyDescription.length < 10) {
      errors.push("Description must be at least 10 characters");
    }
  }

  if (formSection === 1) {
    if (!data.firstName?.trim()) errors.push("First name is required");
    if (!data.lastName?.trim()) errors.push("Last name is required");
    if (!data.phone?.trim()) errors.push("Phone number is required");
    if (!data.email?.trim()) errors.push("Email is required");
    if (!data.designation?.trim()) errors.push("Designation is required");

    if (data.linkedInProfile?.trim() &&
        !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(data.linkedInProfile)) {
      errors.push("Invalid LinkedIn URL");
    }
  }

  return errors;
};

  useEffect(() => {
    employerApi
      .getEmployerProfile(userId)
      .then((result) => {
        const { contactInfo, ...company } = result.data;
        setCompanyInfo(company);
        setContactInfo(contactInfo);
        methods.reset(company);
      })
      .catch(() => navigate("/employer/onboarding"));
  }, [userId, navigate, methods]);

  const handleTabChange = (event, newValue) => {
    setFormSection(newValue);
    methods.reset(newValue === 0 ? companyInfo : contactInfo);
  };

  const onSubmit = (data) => {
    const errors = validateForm(data);
  if (errors.length > 0) {
    setSnackMessage(errors.join(" | "));
    setSnackSeverity("error");
    setSnackOpen(true);
    return;
  }
    const employerProfile =
      formSection === 0
        ? { ...data, contactInfo }
        : { ...companyInfo, contactInfo: { ...data } };

    employerApi
      .updateEmployerProfile(userId, employerProfile)
      .then(() => {
        notify.success("Your profile has been saved successfully.")
        // setMessage("Your profile has been saved successfully.");
        // setMessageClass("alert alert-success");
        setTimeout(() => setMessage(""), 5000);
      })
      .catch((err) => {
        setMessage(err.response?.data?.details || "An error occurred.");
        setMessageClass("alert alert-danger");
        setTimeout(() => setMessage(""), 5000);
      });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* <Typography
        variant="h5"
        sx={{ fontFamily: "Montserrat", fontWeight: 700, mb: 3 }}
      >
        My Profile
      </Typography> */}

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant={formSection === 0 ? "contained" : "outlined"}
          onClick={() => handleTabChange(null, 0)}
          sx={{
            borderRadius: "999px",
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: formSection === 0 ? "#062F54" : "#fff",
            color: formSection === 0 ? "#fff" : "#062F54",
            borderColor: "#062F54",
            px: 3,
            "&:hover": {
              backgroundColor: formSection === 0 ? "#041f39" : "#f5f5f5",
              borderColor: "#062F54",
            },
          }}
        >
          🏢 Organization Details
        </Button>

        <Button
          variant={formSection === 1 ? "contained" : "outlined"}
          onClick={() => handleTabChange(null, 1)}
          sx={{
            borderRadius: "999px",
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: formSection === 1 ? "#062F54" : "#fff",
            color: formSection === 1 ? "#fff" : "#062F54",
            borderColor: "#062F54",
            px: 3,
            "&:hover": {
              backgroundColor: formSection === 1 ? "#041f39" : "#f5f5f5",
              borderColor: "#062F54",
            },
          }}
        >
          👤 Primary Contact
        </Button>
      </Box>

      {message && (
        <Box className={messageClass} sx={{ mb: 2 }}>
          {message}
        </Box>
      )}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              mb: 3,
              backgroundColor: "#fff",
            }}
          >
            {formSection === 0 ? <CompanyInfo /> : <UserContactInfo />}
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#062F54",
                fontFamily: "Poppins, sans-serif",
                textTransform: "none",
                borderRadius: 3,
                px: 3,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#041f39",
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </FormProvider>
      <Snackbar open={snackOpen} autoHideDuration={5000} onClose={() => setSnackOpen(false)}>
  <MuiAlert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }} elevation={6} variant="filled">
    {snackMessage}
  </MuiAlert>
</Snackbar>
    </Box>
  );
};

export default EmployerProfile;
