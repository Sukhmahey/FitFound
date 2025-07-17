import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  Paper,
  Snackbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { updateFileByUrl } from "../../utils/supabaseStorage";
import { AppInfoContext } from "../../contexts/AppInfoContext";

import CompanyInfo from "./onboardingSteps/CompanyInfo";
import UserContactInfo from "./onboardingSteps/UserContactInfo";
import useNotify from "../../utils/notificationService";

const EmployerProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const methods = useForm();
  const [formSection, setFormSection] = useState("details");
  const [companyInfo, setCompanyInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("error");
  const notify = useNotify();

  const { setAppGeneralInfo } = useContext(AppInfoContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "My Profile" });
  }, []);

  const handleFormSectionClick = (e) => {
    setFormSection(e.target.id);
    if (e.target.id === "details") {
      methods.reset(companyInfo);
    } else {
      methods.reset(contactInfo);
    }
  };

  useEffect(() => {
    employerApi
      .getEmployerProfile(userId)
      .then((result) => {
        setUserProfile(result.data);
        const { contactInfo, ...companyData } = result.data;
        setCompanyInfo(companyData);
        setContactInfo(contactInfo);
        methods.reset(companyData);
      })
      .catch((error) => {
        console.log(error);
        navigate("/employer/onboarding");
      });
  }, []);

  const validateForm = (data) => {
    const errors = {};

    if (formSection === "details") {
      if (!data.companyLogo) errors.companyLogo = "Company logo is required";
      if (!data.companyName?.trim())
        errors.companyName = "Company name is required";
      if (
        !data.establishedYear ||
        data.establishedYear < 1900 ||
        data.establishedYear > new Date().getFullYear()
      )
        errors.establishedYear =
          "Established year must be between 1900 and current year";
      if (!data.businessRegisteredNumber?.trim())
        errors.businessRegisteredNumber = "Business Reg. Number is required";
      if (!data.industrySector?.trim())
        errors.industrySector = "Industry sector is required";
      if (!data.companySize?.trim())
        errors.companySize = "Company size is required";
      if (
        ![
          "1-10",
          "11-50",
          "51-200",
          "201-500",
          "501-1000",
          "1001-5000",
          "5000+",
        ].includes(data.companySize)
      )
        errors.companySize = "Invalid company size option";
      if (!data.workLocation?.trim())
        errors.workLocation = "Work location is required";
      if (!data.companyWebsite?.trim())
        errors.companyWebsite = "Company website is required";
      if (
        !data.companyDescription?.trim() ||
        data.companyDescription.length < 10
      )
        errors.companyDescription =
          "Description must be at least 10 characters";
    }

    if (formSection === "contact") {
      if (!data.profilePicture)
        errors.profilePicture = "Profile picture is required";
      if (!data.firstName?.trim()) errors.firstName = "First name is required";
      if (!data.lastName?.trim()) errors.lastName = "Last name is required";
      if (!data.phone?.trim()) errors.phone = "Phone number is required";
      if (!data.email?.trim()) errors.email = "Email is required";
      if (!data.designation?.trim())
        errors.designation = "Designation is required";
      if (
        data.linkedInProfile?.trim() &&
        !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(data.linkedInProfile)
      ) {
        errors.linkedInProfile = "Invalid LinkedIn URL";
      }
    }

    return errors;
  };

  const onSubmit = (data) => {
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSnackMessage(Object.values(errors).join(" , "));
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    setFormErrors({});
    let employerProfile;

    if (formSection === "details") {
      if (data.companyLogo) {
        updateFileByUrl(companyInfo.companyLogo, data.companyLogo)
          .then(console.log)
          .catch(console.log);
      }

      employerProfile = {
        userId,
        companyLogo: companyInfo.companyLogo,
        companyName: data.companyName,
        establishedYear: data.establishedYear,
        businessRegisteredNumber: data.businessRegisteredNumber,
        industrySector: data.industrySector,
        companySize: data.companySize,
        workLocation: data.workLocation,
        companyWebsite: data.companyWebsite,
        companyDescription: data.companyDescription,
        contactInfo,
      };
      setCompanyInfo(data);
    } else {
      if (data.profilePicture) {
        updateFileByUrl(contactInfo.profilePicture, data.profilePicture)
          .then(console.log)
          .catch(console.log);
      }

      const newContactInfo = {
        profilePicture: contactInfo.profilePicture,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        designation: data.designation,
        phone: data.phone,
        email: data.email,
        linkedInProfile: data.linkedInProfile,
        additionalDetails: data.additionalDetails,
      };
      employerProfile = { ...companyInfo, contactInfo: newContactInfo };
      setContactInfo(data);
    }

    employerApi
      .updateEmployerProfile(userId, employerProfile)
      .then(() => {
        setMessage("Success: Info saved.");
        setMessageClass("alert alert-success");
        setTimeout(() => setMessage(""), 5000);
      })
      .catch(() => {
        setMessage("Error: Info not saved.");
        setMessageClass("alert alert-danger");
        setTimeout(() => setMessage(""), 5000);
      });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          variant={formSection === "details" ? "contained" : "outlined"}
          id="details"
          onClick={handleFormSectionClick}
          sx={{
            borderRadius: "999px",
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: formSection === "details" ? "#062F54" : "#fff",
            color: formSection === "details" ? "#fff" : "#062F54",
            borderColor: "#062F54",
            px: 3,
            "&:hover": {
              backgroundColor:
                formSection === "details" ? "#041f39" : "#f5f5f5",
              borderColor: "#062F54",
            },
          }}
        >
          🏢 Organization Details
        </Button>

        <Button
          variant={formSection === "contact" ? "contained" : "outlined"}
          id="contact"
          onClick={handleFormSectionClick}
          sx={{
            borderRadius: "999px",
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: formSection === "contact" ? "#062F54" : "#fff",
            color: formSection === "contact" ? "#fff" : "#062F54",
            borderColor: "#062F54",
            px: 3,
            "&:hover": {
              backgroundColor:
                formSection === "contact" ? "#041f39" : "#f5f5f5",
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
            {formSection === "details" ? (
              <>
                <CompanyInfo />
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                  }}
                >
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
              </>
            ) : (
              <>
                <UserContactInfo />
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                  }}
                >
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
              </>
            )}
          </Paper>
        </form>
      </FormProvider>

      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
      >
        <MuiAlert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default EmployerProfile;
