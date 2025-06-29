import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { employerApi } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';
import { genericFiles, setFileName, addFile, getUlrFile } from "../../utils/supabaseStorage";

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

  const handleFormSectionClick = (e) => {
    setFormSection(e.target.id);
    
    console.log(e.target.id);

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
      
      // saving the logo url
      // if (data.companyLogo) {
      //   const logoFile = data.companyLogo["0"];
      //   const logoFileName = setFileName(data.companyName + "-logo");
      //   const logoFilePath = `logo/${Date.now()}-${logoFileName}`;

      //   addFile(logoFilePath, logoFile);
      //   setLogoUrl(getUlrFile(logoFilePath));

      //   console.log(logoUrl);
      // }
      // else {
      //   return;
      // }

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
        setMessage(`Success: Info saved.`);
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
        }, 5000);
      });
      
    
  };

  return (
    <div>
      <div>
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
      </div>

      <div id="message">{ message }</div>

      {/* <div>
        <div id="details" onClick={ (e) => handleFormSectionClick(e) }>Organisation Details</div>
        <div id="contact" onClick={ (e) => handleFormSectionClick(e) }>Primary Contact</div>
      </div> */}

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
