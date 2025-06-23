import { useState } from "react";

import { useForm, FormProvider } from "react-hook-form";
import CompanyInfo from './onboardingSteps/CompanyInfo';
import UserContactInfo from './onboardingSteps/UserContactInfo';
import { employerApi } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';

const EmployerOnboarding = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const methods = useForm();
  const [formSection, setFormSection] = useState("details"); // the other is contact
  // const [employerProfile, setEmployerProfile] = useState({});

  // const handleFormSectionClick = (e) => {
  //   setFormSection(e.target.id);
  //   console.log(e.target.id);
  // };

  const onSubmit = (data) => {
    if (formSection == "details") {
      setFormSection('contact');
    }
    
    if (formSection == "contact") {

      const employerProfile = {
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
        contactInfo: {
          profilePicture: "https://example.com/profile.jpg", // data.profilePicture,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          designation: data.designation,
          phone: data.phone,
          email: data.email,
          linkedInProfile: data.linkedInProfile,
          additionalDetails: data.additionalDetails
        }
      };

      console.log(employerProfile);
      
      // save data
      employerApi.addEmployerProfile(userId, employerProfile)
      .then( result => {
        console.log(result);
      })
      .catch( error => {
        console.log(error);
      });
    }
    
  };

  return (
    <div>
      
      <div>
        <span>Organisation Details</span>
        <span>Primary Contact Person</span>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          { formSection === "details" && (<>
            <div className="container">
              <div className="row">
                <CompanyInfo />
                <div className="d-flex justify-content-end gap-4">
                  <input type="submit" value="next" className="btn btn-primary btn-sm mb-3" />
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

export default EmployerOnboarding;
