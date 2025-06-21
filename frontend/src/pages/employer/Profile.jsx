import { useState } from "react";
import CompanyInfo from './onboardingSteps/CompanyInfo';
import UserContactInfo from './onboardingSteps/UserContactInfo';

const EmployerProfile = () => {
  const [formSection, setFormSection] = useState("details"); // the other is contact

  const handleFormSectionClick = (e) => {
    setFormSection(e.target.id);
    console.log(e.target.id);
  };

  return (
    <div>
      <div>
        <button onClick={ (e) => handleFormSectionClick(e) } id="details">Organisation Details</button>
        <button onClick={ (e) => handleFormSectionClick(e) } id="contact">Primary Contact Person</button>
      </div>
      
      <form>
        { formSection === "details" && (<>
          <div className="container">
            <div className="row">
              <CompanyInfo />
              <div class="d-flex justify-content-end gap-4">
                <input type="submit" value="save" class="btn btn-primary btn-sm mb-3" />
              </div>
            </div>
          </div>
        </>) }

        { formSection === "contact" && (<>
          <div className="container">
            <div className="row">
              <UserContactInfo />
              <div class="d-flex justify-content-end gap-4">
                <input type="submit" value="save" class="btn btn-primary btn-sm mb-3" />
              </div>
            </div>
          </div>
        </>) }
      </form>
    </div>
  );
};

export default EmployerProfile;
