import { useEffect, useState, useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  genericFiles,
  setFileName,
  addFile,
  getUlrFile,
} from "../../utils/supabaseStorage";
import { AppInfoContext } from "../../contexts/AppInfoContext";

import { Box, Button, Paper, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

import CompanyInfo from "./onboardingSteps/CompanyInfo";
import UserContactInfo from "./onboardingSteps/UserContactInfo";
import useNotify from "../../utils/notificationService";

const EmployerOnboarding = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const methods = useForm();
  const navigate = useNavigate();
  const [formSection, setFormSection] = useState(0);
  const [logoUrl, setLogoUrl] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("error");
  const notify = useNotify();
  let profilePictureUrl;

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
    setAppGeneralInfo({ pageTitle: "Onboarding" });
  }, []);

  const validateForm = (data) => {
    const errors = {};

    if (formSection === 0) {
      if(!data.companyLogo)
        errors.companyLogo = "Company logo image is required";
      if (!data.companyName?.trim())
        errors.companyName = "Company name is required";
      if (
        !data.establishedYear ||
        data.establishedYear < 1900 ||
        data.establishedYear > new Date().getFullYear()
      ) {
        errors.establishedYear =
          "Established year must be between 1900 and current year";
      }
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
      ) {
        errors.companySize = "Invalid company size option";
      }
      if (!data.workLocation?.trim())
        errors.workLocation = "Work location is required";
      if (!data.companyWebsite?.trim())
        errors.companyWebsite = "Company website is required";
      if (
        !data.companyDescription?.trim() ||
        data.companyDescription.length < 10
      ) {
        errors.companyDescription =
          "Description must be at least 10 characters";
      }
    }

    if (formSection === 1) {
      if (!data.profilePicture) errors.profilePicture = "Profile picture image is required";
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
      const messageText = Object.values(errors).join(" , ");
      setSnackMessage(messageText);
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }
    setFormErrors({});

    if (formSection === 0) {
      if (data.companyLogo) {
        const logoFile = data.companyLogo;
        const logoFileName = setFileName(data.companyName + "-logo");
        const logoFilePath = `logo/${Date.now()}-${logoFileName}`;
        addFile(logoFilePath, logoFile);
        setLogoUrl(getUlrFile(logoFilePath));
      }
      setFormSection(1);
      return;
    }

    if (formSection === 1) {
      if (data.profilePicture) {
        const profileFile = data.profilePicture;
        const profileFileName = setFileName(
          data.companyName + "-profile-picture"
        );
        const profileFilePath = `profile-picture/${Date.now()}-${profileFileName}`;
        addFile(profileFilePath, profileFile);
        profilePictureUrl = getUlrFile(profileFilePath);
      }

      const employerProfile = {
        userId,
        companyLogo: logoUrl,
        companyName: data.companyName,
        establishedYear: data.establishedYear,
        businessRegisteredNumber: data.businessRegisteredNumber,
        industrySector: data.industrySector,
        companySize: data.companySize,
        workLocation: data.workLocation,
        companyWebsite: data.companyWebsite,
        companyDescription: data.companyDescription,
        contactInfo: {
          profilePicture: profilePictureUrl,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          designation: data.designation,
          phone: data.phone,
          email: data.email,
          linkedInProfile: data.linkedInProfile,
          additionalDetails: data.additionalDetails,
        },
      };

      employerApi
        .addEmployerProfile(userId, employerProfile)
        .then(() => {
          notify.success("Your profile has been saved successfully.");
          setTimeout(() => {
            navigate("/employer/dashboard");
          }, 1000);
        })
        .catch((error) => {
          setSnackMessage(
            error.response?.data?.details || "An error occurred."
          );
          setSnackSeverity("error");
          setSnackOpen(true);
        });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant={formSection === 0 ? "contained" : "outlined"}
          onClick={() => setFormSection(0)}
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
          disabled={formSection === 0}
          onClick={() => setFormSection(1)}
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
            {formSection === 0 ? (
              <CompanyInfo errors={formErrors} />
            ) : (
              <UserContactInfo errors={formErrors} />
            )}
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
              {formSection === 0 ? "Next" : "Save Changes"}
            </Button>
          </Box>
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

export default EmployerOnboarding;
