import React from 'react';
import { useState } from 'react';
import PersonalInfoStep from './onboardingSteps/PersonalInfoStep';
import EducationSkillsStep from './onboardingSteps/EducationSkillsStep';
import WorkExperienceStep from './onboardingSteps/WorkExperienceStep';

export default function CandidateOnboarding() {

    const [stepIndex, setStepIndex] = useState(0);
    const [formData, setFormData] = useState({
        personalInfo: {},
        workExperience: {},
        educationSkills: {}
    });

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
        return <PersonalInfoStep data={formData.personalInfo} onUpdate={(data) => updateFormData('personalInfo', data)} />;
      case 1:
        return <WorkExperienceStep data={formData.workExperience} onUpdate={(data) => updateFormData('workExperience', data)} />;
      case 2:
        return <EducationSkillsStep data={formData.educationSkills} onUpdate={(data) => updateFormData('educationSkills', data)} />;
      default:
        return null;
    }
};



    return (
        <div>
            <div>Onboarding ({stepIndex+1}/3)</div>
            {renderStep()}
            <div>
                {stepIndex>0 && <button onClick={handlePrevBtn}>Back</button>}
                <button onClick={handleNextBtn}>{stepIndex===2?'Finish':'Next'}</button>
            </div>

            


        </div>
    )

}
