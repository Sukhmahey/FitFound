import React from 'react';
import { useState } from 'react';
import PersonalInfoStep from './onboardingSteps/PersonalInfoStep';
import EducationSkillsStep from './onboardingSteps/EducationSkillsStep';
import WorkExperienceStep from './onboardingSteps/WorkExperienceStep';
import ProfileSetupOption from './onboardingSteps/ProfileSetupOption';
import ResumeParsing from './onboardingSteps/ResumeParsing';


export default function CandidateOnboarding() {

    const [stepIndex, setStepIndex] = useState(0);
    const [formData, setFormData] = useState({
        personalInfo: {},
        workExperience: {},
        educationSkills: {}
    });

    const handleManual = () => {
    console.log("Manual form selected");
    setStepIndex(1);
    
  };

  const handleUpload = () => {
    console.log("Resume upload selected");
    setStepIndex(4);
   
  };
    const handleNextBtn = () => {
        if (stepIndex === 0) {
            setStepIndex(1);
        }
        else if (stepIndex === 1) {
            setStepIndex(2);
        }
        else if (stepIndex === 2) {
            setStepIndex(3);
        }
        else {
            console.log('Final Form Data:', formData);
        }

    }

    const handlePrevBtn = () => {
        if (stepIndex === 1) {
            setStepIndex(0);
        }
        else if (stepIndex === 2) {
            setStepIndex(1);
        }
        else if (stepIndex === 3) {
            setStepIndex(2);
        }
    }

    const updateFormData = (section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                ...data
            }
        }));
    };
    const renderStep = () => {
    switch (stepIndex) {

        case 0:
            return <ProfileSetupOption onManualClick={handleManual} onUploadClick={handleUpload} />;
        case 1:
            return <PersonalInfoStep data={formData.personalInfo} onUpdate={(data) => updateFormData('personalInfo', data)} />;
        case 2:
            return <WorkExperienceStep data={formData.workExperience} onUpdate={(data) => updateFormData('workExperience', data)} />;
        case 3:
            return <EducationSkillsStep data={formData.educationSkills} onUpdate={(data) => updateFormData('educationSkills', data)} />;
        case 4:
            return<ResumeParsing setStep={setStepIndex}></ResumeParsing>
        default:
            return null;
    }
};



    return (
        <div>
            <div>Onboarding ({stepIndex+1}/4)</div>
            {renderStep()}
            {stepIndex>0 && stepIndex!==4 &&<div>
                {stepIndex>0 && <button onClick={handlePrevBtn}>Back</button>}
                <button onClick={handleNextBtn}>{stepIndex===3?'Finish':'Next'}</button>
            </div>}

        <div className='onboarding-container'>
            <div className="step-indicator">Onboarding ({stepIndex+1}/3)</div>
            <div className="form-section">
                {renderStep()}
            </div>
            
            <div className="step-buttons">
                {stepIndex>0 && <button className="back-button" onClick={handlePrevBtn}>Back</button>}
                <button className="next-button" onClick={handleNextBtn}>{stepIndex===2?'Finish':'Next'}</button>
            </div>

            


        </div>
              </div>
    )

}
