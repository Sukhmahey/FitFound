import { useEffect, useState } from "react";
import { useContext } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Box, Typography, Tabs, Tab, Button, Paper } from "@mui/material";

import { employerApi } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';
import { updateFileByUrl } from "../../utils/supabaseStorage";
import { AppInfoContext } from "../../contexts/AppInfoContext";

import CompanyInfo from './onboardingSteps/CompanyInfo';
import UserContactInfo from './onboardingSteps/UserContactInfo';

const EmployerProfile = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const methods = useForm();
  const [formSection, setFormSection] = useState("details"); // the other is contact
  const [companyInfo, setCompanyInfo] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [logoUrl, setLogoUrl] = useState("");
  let profilePictureUrl;
  const [detailsIsActive, setDetailsIsActive] = useState(true);
  const [contactIsActive, setContactIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [messageClass, setMessageClass] = useState("");

  const { setAppGeneralInfo } = useContext(AppInfoContext);
  
    useEffect(() => {
        setAppGeneralInfo({ pageTitle: "My Profile"});
    }, []);

  const handleFormSectionClick = (e) => {
    setFormSection(e.target.id);
    
    // console.log(e.target.id);

    // when the user changes the form section
    if (e.target.id == "details") {
      methods.reset(companyInfo);

      setDetailsIsActive(true);
      setContactIsActive(false);
    }
    else {
      methods.reset(contactInfo);

      setDetailsIsActive(false);
      setContactIsActive(true);
    }
  };

  useEffect(() => {
    // Getting the user profile by ID
    employerApi.getEmployerProfile(userId)
    .then( result => {
      setUserProfile(result.data);
      // setting the data for every form section
      const { contactInfo, ...companyInfo } = result.data; 
      setCompanyInfo( companyInfo );
      methods.reset( companyInfo );
      setContactInfo(result.data.contactInfo);

    })
    .catch( error => {
      console.log(error);
    });
  }, []);

  const onSubmit = (data) => {

    let employerProfile;
    
    if (formSection == "details") {
      
      // console.log(typeof data.companyLogo != "string");
      // updating the logo url
      if (data.companyLogo) {
        updateFileByUrl(companyInfo.companyLogo, data.companyLogo)
        .then( result => console.log(result) )
        .catch( error => console.log(error) );
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
        contactInfo: contactInfo
      };
      setCompanyInfo(data);
    }
    else {

      if (data.profilePicture) {
        updateFileByUrl(contactInfo.profilePicture, data.profilePicture)
        .then( result => console.log(result) )
        .catch( error => console.log(error) );
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
        additionalDetails: data.additionalDetails
      };
      employerProfile = {...companyInfo , contactInfo: newContactInfo };
      setContactInfo(data);
    }

      
      // save data
      employerApi.updateEmployerProfile(userId, employerProfile)
      .then( result => {
        console.log(result);
        setMessage(`Success: Info saved.`);
        setMessageClass("alert alert-success");
        // Hide the message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);

      })
      .catch( error => {
        console.log(error);
        setMessage(`Error: Info not saved.`);
        // Hide the message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setMessageClass("alert alert-danger");
        }, 5000);
      });
      
    
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* <div>
        <ul className="nav nav-underline">
          <li className="nav-item">
            <a className={`nav-link ${detailsIsActive ? 'active' : ''}`} aria-current="page" 
            id="details" onClick={ (e) => handleFormSectionClick(e) }>Organisation Details</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${contactIsActive ? 'active' : ''}`} aria-disabled="true"
            id="contact" onClick={ (e) => handleFormSectionClick(e) }>Primary Contact</a>
          </li>
        </ul>
      </div> */}

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant={formSection === "contact" ? "contained" : "outlined"}
          id="details"
          onClick={(e) => handleFormSectionClick(e)}
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
          variant={formSection === "details" ? "contained" : "outlined"}
          id="contact"
          onClick={(e) => handleFormSectionClick(e)}
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

      {/* <div id="message">{ message }</div> */}

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
            { formSection === "details" && (<>
              <div className="container">
                <div className="row">
                  <CompanyInfo />
                  <div className="d-flex justify-content-end gap-4">
                    {/* <input type="submit" value="save" className="btn btn-primary btn-sm mb-3" /> */}
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
            </>) }

            { formSection === "contact" && (
              <>
              <div className="container">
                <div className="row">
                  <UserContactInfo />
                  <div className="d-flex justify-content-end gap-4">
                    {/* <input type="submit" value="save" className="btn btn-primary btn-sm mb-3" /> */}

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
            </>) }
            
          </Paper>
          
        </form>
      </FormProvider>
      
      
    </Box>
  );
};

export default EmployerProfile;
