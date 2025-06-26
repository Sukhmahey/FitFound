import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { employerApi } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';

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

  const handleFormSectionClick = (e) => {
    setFormSection(e.target.id);

    // when the user changes the form section
    if (e.target.id == "details") {
      methods.reset(companyInfo);
    }
    else {
      methods.reset(contactInfo);
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
      employerProfile = {
        userId: userId,
        companyLogo: "https://example.com/logo.png", //data.companyLogo,
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
      let newContactInfo = {
        profilePicture: "https://example.com/profile.jpg", // data.profilePicture,
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

      

      console.log(employerProfile);
      
      // save data
      employerApi.updateEmployerProfile(userId, employerProfile)
      .then( result => {
        console.log(result);
      })
      .catch( error => {
        console.log(error);
      });
    
  };

  return (
    <div>
      
      <div>
        <div id="details" onClick={ (e) => handleFormSectionClick(e) }>Organisation Details</div>
        <div id="contact" onClick={ (e) => handleFormSectionClick(e) }>Primary Contact</div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          { formSection === "details" && (<>
            <div className="container">
              <div className="row">
                <CompanyInfo />
                <div className="d-flex justify-content-end gap-4">
                  <input type="submit" value="save" className="btn btn-primary btn-sm mb-3" />
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
                  <input type="submit" value="save" className="btn btn-primary btn-sm mb-3" />
                </div>
              </div>
            </div>
          </>) }
        </form>
      </FormProvider>
      
      
    </div>
  );
};

export default EmployerProfile;
