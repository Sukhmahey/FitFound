import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from "react-hook-form";
import { Box, Typography, Button, Paper } from "@mui/material";

import { employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { updateFileByUrl } from "../../utils/supabaseStorage";
import { AppInfoContext } from "../../contexts/AppInfoContext";

import CompanyInfo from "./onboardingSteps/CompanyInfo";
import UserContactInfo from "./onboardingSteps/UserContactInfo";

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

  const { setAppGeneralInfo } = useContext(AppInfoContext);

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
        methods.reset(companyData);
        setContactInfo(contactInfo);
      })
      .catch((error) => {
        console.log(error);
        navigate('/employer/onboarding');
      });
  }, []);

  const onSubmit = (data) => {
    let employerProfile;

    if (formSection === "details") {
      if (data.companyLogo) {
        updateFileByUrl(companyInfo.companyLogo, data.companyLogo)
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
      }

      employerProfile = {
        userId: userId,
        companyLogo: companyInfo.companyLogo,
        companyName: data.companyName,
        establishedYear: data.establishedYear,
        businessRegisteredNumber: data.businessRegisteredNumber,
        industrySector: data.industrySector,
        companySize: data.companySize,
        workLocation: data.workLocation,
        companyWebsite: data.companyWebsite,
        companyDescription: data.companyDescription,
        contactInfo: contactInfo,
      };
      setCompanyInfo(data);
    } else {
      if (data.profilePicture) {
        updateFileByUrl(contactInfo.profilePicture, data.profilePicture)
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
      }

      let newContactInfo = {
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
      .then((result) => {
        setMessage(`Success: Info saved.`);
        setMessageClass("alert alert-success");
        setTimeout(() => setMessage(""), 5000);
      })
      .catch((error) => {
        console.log(error);
        setMessage(`Error: Info not saved.`);
        setMessageClass("alert alert-danger");
        setTimeout(() => setMessage(""), 5000);
      });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
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
            {formSection === "details" && (
              <div className="container">
                <div className="row">
                  <CompanyInfo />
                  <div className="d-flex justify-content-end gap-4">
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
                  </div>
                </div>
              </div>
            )}

            {formSection === "contact" && (
              <div className="container">
                <div className="row">
                  <UserContactInfo />
                  <div className="d-flex justify-content-end gap-4">
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
                  </div>
                </div>
              </div>
            )}
          </Paper>
        </form>
      </FormProvider>
    </Box>
  );
};

export default EmployerProfile;
