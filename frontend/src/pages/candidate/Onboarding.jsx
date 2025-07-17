// CandidateOnboarding.jsx (Unified file including redesigned ProfileSetupOption)

import React, { useState, useEffect } from "react";
import { candidateApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PersonalInfoStep from "./onboardingSteps/PersonalInfoStep";
import BasicInfoStep from "./onboardingSteps/BasicInfoStep";
import SkillsStep from "./onboardingSteps/SkillsStep";
import ResumeParsing from "./onboardingSteps/ResumeParsing";
import WorkExperienceStep from "./onboardingSteps/WorkExperienceStep";
import PortfolioStep from "./onboardingSteps/PortfolioStep";
import EducationStep from "./onboardingSteps/EducationStep";
import JobPreferenceStep from "./onboardingSteps/JobPreferenceStep";
import InfoConfirmationPage from "./onboardingSteps/InfoConfirmationPage";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import useNotify from "../../utils/notificationService";
import {
  Box,
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Stack,
  FormHelperText,
} from "@mui/material";

const ProfileSetupOption = ({ onManualClick, onUploadClick, errors }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "white",
          p: 5,
          borderRadius: 4,
          boxShadow: 3,
          maxWidth: 600,
          width: "90%",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{ color: "#0E3A62" }}
        >
          Welcome to FitFound!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: "#0E3A62" }}>
          How would you like to get started with setting up your profile?
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          <Box textAlign="center">
            <Button
              onClick={onManualClick}
              sx={{
                backgroundColor: "#3B67F6",
                color: "white",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1rem",
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#0E3A62",
                },
              }}
            >
              Fill Details Manually
            </Button>
            {errors?.manual && (
              <FormHelperText error>{errors.manual}</FormHelperText>
            )}
          </Box>

          <Box textAlign="center">
            <Button
              onClick={onUploadClick}
              sx={{
                backgroundColor: "#F0AD4E",
                color: "#0E3A62",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1rem",
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#EF5350",
                  color: "white",
                },
              }}
            >
              Upload Resume
            </Button>
            {errors?.upload && (
              <FormHelperText error>{errors.upload}</FormHelperText>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default function CandidateOnboarding() {
  const { user } = useAuth();
  const userId = user?.userId;
  const userEmail = user?.email;
  const navigate = useNavigate();
  const notify = useNotify();
  const [formErrors, setFormErrors] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [confirmedData, setConfirmedData] = useState(null);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      currentStatus: "",
      specialization: "",
    },
    basicInfo: {
      phoneNumber: "",
      workStatus: "",
      language: "",
      bio: "",
      additionalInfo: "",
    },
    skills: [],
    workExperience: [],
    portfolio: {
      socialLinks: {
        linkedin: "",
        personalPortfolioWebsite: "",
        additionalLinks: [],
      },
    },
    education: [],
    jobPreference: {
      desiredJobTitle: [],
      jobType: "",
      salaryExpectation: {
        min: 0,
        perHour: false,
        perYear: false,
      },
    },
  });

  const handleManual = () => setStepIndex(1);
  const handleUpload = () => setStepIndex(14);
  useEffect(() => {
    if (userEmail && !formData.personalInfo.email) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          email: userEmail,
        },
      }));
    }
  }, [userEmail]);

  const convertMonthFormat = (value) => {
    if (!value || typeof value !== "string") return "";
    const parts = value.split("-");
    if (parts.length === 2 && parts[0].length === 4 && parts[1].length === 2) {
      const [year, month] = parts;
      return `${month}-${year}`;
    }
    return value;
  };

  const validateStep = () => {
    let errors = {};
    if (stepIndex === 1) {
      const { firstName, lastName } = formData.personalInfo;
      if (!firstName.trim()) errors.firstName = "First name is required";
      if (!lastName.trim()) errors.lastName = "Last name is required";
    }
    if (stepIndex === 2) {
      const { phoneNumber } = formData.basicInfo;
      if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    }
    if (stepIndex === 3) {
      if (formData.skills.length === 0)
        errors.skills = "Add at least one skill";
    }
    if (stepIndex === 4) {
      formData.workExperience.forEach((exp, i) => {
        if (!exp.companyName)
          errors[`companyName_${i}`] = "Company name is required";
        if (!exp.role) errors[`role_${i}`] = "Job Role is required";
        if (!exp.startDate) errors[`startDate_${i}`] = "Start Date is required";
        if (!exp.endDate) errors[`endDate_${i}`] = "End Date is required";
        if (!exp.experienceLevel)
          errors[`experienceLevel_${i}`] = "Experience Level is required";
      });
    }
    if (stepIndex === 6) {
      formData.education.forEach((edu, i) => {
        if (!edu.instituteName?.trim())
          errors[`instituteName_${i}`] = "Institute name is required";
        if (!edu.credentials?.trim())
          errors[`credentials_${i}`] = "Credentials are required";
        if (!edu.startDate)
          errors[`eduStartDate_${i}`] = "Start date is required";
        if (!edu.endDate) errors[`eduEndDate_${i}`] = "End date is required";
      });
    }
    if (stepIndex === 7) {
      const desired = formData.jobPreference.desiredJobTitle;
      const jobType = formData.jobPreference.jobType;
      if (!desired || desired.length === 0 || !desired[0]?.trim()) {
        errors.selectedRole = "Desired Role is required";
      }
      if (!jobType.trim()) errors.jobType = "Job type is required";
    }
    return errors;
  };

  const handleNextBtn = async () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const messages = Object.values(errors);
      const messageText = messages.join(", ");
      setSnackMsg(`Please fix: ${messageText}`);
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }
    setFormErrors({});
    try {
      if (stepIndex === 1) {
        await candidateApi.updatePersonalInfo(userId, formData.personalInfo);
        setStepIndex(2);
      } else if (stepIndex === 2) {
        await candidateApi.updateBasicInfo(userId, formData.basicInfo);
        setStepIndex(3);
      } else if (stepIndex === 3) {
        const cleanedSkills = formData.skills.map((skill) => ({
          skill: skill.skill?.trim?.() || "",
        }));
        await candidateApi.updateSkills(userId, { skills: cleanedSkills });
        setStepIndex(4);
      } else if (stepIndex === 4) {
        const cleanedExperience = formData.workExperience.map((item) => ({
          ...item,
          startDate: convertMonthFormat(item.startDate),
          endDate: convertMonthFormat(item.endDate),
          achievements: item.achievements?.filter((a) => a.trim()) || [],
        }));
        await candidateApi.updateWorkHistory(userId, {
          workHistory: cleanedExperience,
        });
        setStepIndex(5);
      } else if (stepIndex === 5) {
        await candidateApi.updatePortfolio(userId, {
          socialLinks: formData.portfolio.socialLinks,
        });
        setStepIndex(6);
      } else if (stepIndex === 6) {
        const cleanedEducation = formData.education.map((item) => ({
          ...item,
          startDate: convertMonthFormat(item.startDate),
          endDate: convertMonthFormat(item.endDate),
        }));
        await candidateApi.updateEducation(userId, {
          education: cleanedEducation,
        });
        setStepIndex(7);
      } else if (stepIndex === 7) {
        await candidateApi.updateJobPreference(userId, formData.jobPreference);
        setSnackMsg("Profile saved successfully!");
        notify.success("Profile saved successfully!");
        setSnackSeverity("success");
        setSnackOpen(true);
        navigate("/candidate/dashboard");
      }
    } catch (err) {
      console.error("Failed to submit:", err);
      setSnackMsg("Failed to submit");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  };

  const handlePrevBtn = () => {
    if (stepIndex > 0 && stepIndex < 99) setStepIndex(stepIndex - 1);
  };

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? data
        : {
            ...prev[section],
            ...data,
          },
    }));
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackOpen(false);
  };

  const steps = [
    "Personal Information",
    "Basic Information",
    "Skill set",
    "Work Experience",
    "Portfolio Details",
    "Education",
    "Job Preference",
  ];

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return (
          <ProfileSetupOption
            onManualClick={handleManual}
            onUploadClick={handleUpload}
            errors={formErrors}
          />
        );
      case 1:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData("personalInfo", data)}
            userEmail={userEmail}
            errors={formErrors}
          />
        );
      case 2:
        return (
          <BasicInfoStep
            data={formData.basicInfo}
            onUpdate={(data) => updateFormData("basicInfo", data)}
            errors={formErrors}
          />
        );
      case 3:
        return (
          <SkillsStep
            data={formData.skills}
            onUpdate={(data) => updateFormData("skills", data)}
            errors={formErrors}
          />
        );
      case 14:
        return (
          <ResumeParsing
            setStep={setStepIndex}
            setConfirmedData={setConfirmedData}
          />
        );
      case 4:
        return (
          <WorkExperienceStep
            data={formData.workExperience}
            onUpdate={(data) => updateFormData("workExperience", data)}
            errors={formErrors}
          />
        );
      case 5:
        return (
          <PortfolioStep
            data={formData.portfolio}
            onUpdate={(data) => updateFormData("portfolio", data)}
            errors={formErrors}
          />
        );
      case 6:
        return (
          <EducationStep
            data={formData.education}
            onUpdate={(data) => updateFormData("education", data)}
            errors={formErrors}
          />
        );
      case 7:
        return (
          <JobPreferenceStep
            data={formData.jobPreference}
            onUpdate={(data) => updateFormData("jobPreference", data)}
            errors={formErrors}
          />
        );
      case 99:
        return <InfoConfirmationPage data={confirmedData} />;
      default:
        return null;
    }
  };

  return (
    <Container sx={{ p: 4, ml: 0, margin: "auto" }}>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </MuiAlert>
      </Snackbar>
      {stepIndex > 0 && stepIndex < 90 && stepIndex !== 14 && (
        <Box sx={{ width: "100%", mb: 8 }}>
          <Stepper activeStep={stepIndex - 1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}
      <div sx={{ width: "100%" }}>{renderStep()}</div>
      {stepIndex < 90 && stepIndex > 0 && stepIndex !== 14 && (
        <Box className="d-flex justify-content-between mt-5 mb-5">
          <Button
            onClick={handlePrevBtn}
            variant="outlined"
            sx={{
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 1.5,
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleNextBtn}
            variant="contained"
            sx={{
              backgroundColor: "#0E3A62",
              color: "white",
              fontFamily: "Poppins, sans-serif",
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": { backgroundColor: "#062F54" },
            }}
          >
            {stepIndex === 7 ? "Finish" : "Next"}
          </Button>
          {/* <Button variant="contained" color="primary" onClick={handlePrevBtn}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNextBtn}>
            {stepIndex === 7 ? "Finish" : "Next"}
          </Button> */}
        </Box>
      )}
    </Container>
  );
}
