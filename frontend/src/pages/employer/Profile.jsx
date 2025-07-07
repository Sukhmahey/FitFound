import { useEffect, useState, useContext } from "react";
import { Box, Typography, Tabs, Tab, Button, Paper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { AppInfoContext } from "../../contexts/AppInfoContext";
import CompanyInfo from "./onboardingSteps/CompanyInfo";
import UserContactInfo from "./onboardingSteps/UserContactInfo";

const EmployerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const methods = useForm();
  const [formSection, setFormSection] = useState(0);
  const [companyInfo, setCompanyInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "My Profile" });
  }, [setAppGeneralInfo]);

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
    const employerProfile =
      formSection === 0
        ? { ...data, contactInfo }
        : { ...companyInfo, contactInfo: { ...data } };

    employerApi
      .updateEmployerProfile(userId, employerProfile)
      .then(() => {
        setMessage("Your profile has been saved successfully.");
        setMessageClass("alert alert-success");
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
      <Typography
        variant="h5"
        sx={{ fontFamily: "Montserrat", fontWeight: 700, mb: 3 }}
      >
        My Profile
      </Typography>

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
    </Box>
  );
};

export default EmployerProfile;
