import { useEffect, useState } from "react";
import { useContext } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { genericFiles, setFileName, addFile, getUlrFile } from "../../utils/supabaseStorage";
import { AppInfoContext } from "../../contexts/AppInfoContext";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { employerApi } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';

import CompanyInfo from './onboardingSteps/CompanyInfo';
import UserContactInfo from './onboardingSteps/UserContactInfo';

const EmployerOnboarding = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const methods = useForm();
  const [formSection, setFormSection] = useState("details"); // the other is contact
  const [logoUrl, setLogoUrl] = useState("");
  const [detailsIsActive, setDetailsIsActive] = useState(true);
  const [contactIsActive, setContactIsActive] = useState(false);
  let profilePictureUrl;

  const { setAppGeneralInfo } = useContext(AppInfoContext);

  useEffect(() => {
      setAppGeneralInfo({ pageTitle: "Onboarding"});
  }, []);
  

  const onSubmit = (data) => {
    if (formSection == "details") {
      // Tabs css
      setDetailsIsActive(false);
      setContactIsActive(true);

      console.log(data);

      // save the logo and profile picture
      if (data.companyLogo) {
        const logoFile = data.companyLogo;
        const logoFileName = setFileName(data.companyName + "-logo");
        const logoFilePath = `logo/${Date.now()}-${logoFileName}`;

        // console.log(logoFile);
        // return;

        addFile(logoFilePath, logoFile);
        setLogoUrl(getUlrFile(logoFilePath));

        console.log(logoUrl);
      }
      else {
        return;
      }

      setFormSection('contact');
    }
    
    if (formSection == "contact") {
      // Tabs css
      setDetailsIsActive(false);
      setContactIsActive(true);

      console.log(data);

      if (data.profilePicture) {
        const profileFile = data.profilePicture["0"];
        const profileFileName = setFileName(data.companyName + "-profile-picture");
        const profileFilePath = `profile-picture/${Date.now()}-${profileFileName}`;

        addFile(profileFilePath, profileFile);
        profilePictureUrl= getUlrFile(profileFilePath);
        console.log(profilePictureUrl);
      }
      else {
        return;
      }

      const employerProfile = {
        userId: userId,
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
        <ul className="nav nav-underline">
          <li className="nav-item">
            <a className={`nav-link ${detailsIsActive ? 'active' : 'disabled'}`} aria-current="page" href="#">Organisation Details</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${contactIsActive ? 'active' : 'disabled'}`} aria-disabled="true">Primary Contact</a>
          </li>
        </ul>
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
