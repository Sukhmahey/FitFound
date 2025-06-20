import { useState } from "react";
import CompanyInfo from './onboardingSteps/CompanyInfo';
import UserContactInfo from './onboardingSteps/UserContactInfo';

const EmployerOnboarding = () => {
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
        { formSection === "details" && <CompanyInfo /> }
        { formSection === "contact" && <UserContactInfo /> }

        <div class="d-flex justify-content-end gap-4">
          <input type="reset" value="Cancel" class="btn btn-secondary btn-sm mb-3" />
          <input type="submit" value="save" class="btn btn-primary btn-sm mb-3" />
        </div>
      </form>
    </div>
  );
};

export default EmployerOnboarding;
