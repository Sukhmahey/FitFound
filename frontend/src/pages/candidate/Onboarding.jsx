import React, { useState } from 'react';
import { candidateApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

import PersonalInfoStep from './onboardingSteps/PersonalInfoStep';
import EducationSkillsStep from './onboardingSteps/EducationSkillsStep';
import WorkExperienceStep from './onboardingSteps/WorkExperienceStep';
import ProfileSetupOption from './onboardingSteps/ProfileSetupOption';
import ResumeParsing from './onboardingSteps/ResumeParsing';
import InfoConfirmationPage from './onboardingSteps/InfoConfirmationPage';

export default function CandidateOnboarding() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [stepIndex, setStepIndex] = useState(0);
  const [confirmedData, setConfirmedData] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {},
    workExperience: [],
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

  const convertMonthFormat = (value) => {
  if (!value || !value.includes("-")) return value;
  const [year, month] = value.split("-");
  return `${month}-${year}`;
};



  const handleNextBtn = async () => {
    const cleanedPersonalInfo = {
      ...formData.personalInfo,
      salary: Number(formData.personalInfo.salary),
      yearsOfExperience: Number(formData.personalInfo.yearsOfExperience),
      preferredRole: formData.personalInfo.prefferedRole,
    };
    delete cleanedPersonalInfo.prefferedRole;

    const educationData = [{
      degree: formData.educationSkills.degree,
      field: formData.educationSkills.field,
      gradYear: formData.educationSkills.gradYear,
      institution: formData.educationSkills.institution
    }];

    const skillsData = formData.educationSkills.skills
      ? formData.educationSkills.skills.split(',').map(skill => ({ skill: skill.trim() }))
      : [];

    
const cleanedWorkExperience = formData.workExperience.map(item => ({
  ...item,
  startDate: convertMonthFormat(item.startDate),
  endDate: convertMonthFormat(item.endDate),
  achievements: item.achievements
    ? item.achievements.split(',').map(a => a.trim())
    : [],
  technologiesUsed: item.technologiesUsed
    ? item.technologiesUsed.split(',').map(t => t.trim())
    : []
}));



    try {
      if (stepIndex === 1) {
        await candidateApi.updateProfile(userId, cleanedPersonalInfo);
        setStepIndex(2);
      } else if (stepIndex === 2) {
        await candidateApi.updateWorkHistory(userId, { workHistory: cleanedWorkExperience });
        setStepIndex(3);
      } else if (stepIndex === 3) {
        await candidateApi.updateEducation(userId, { education: educationData });
        await candidateApi.updateSkills(userId, { skills: skillsData });
        alert("Profile saved successfully!");
      } else if (stepIndex === 0) {
        
        setStepIndex(1);
      }
      
    } catch (err) {
      console.error("Failed to submit:", err);
      alert("Submission failed.");
    }
  };

  const handlePrevBtn = () => {
    if (stepIndex > 0 && stepIndex < 4) {
      setStepIndex(stepIndex - 1);
    }
  };

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section]) ? data : {
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
        return <ResumeParsing setStep={setStepIndex} setConfirmedData={setConfirmedData}/>;
      case 99:
        return <InfoConfirmationPage data={confirmedData}></InfoConfirmationPage>
      default:
        return null;
    }
  };

  return (
    <div>
      <div>Onboarding</div>
      {stepIndex <90 && stepIndex !== 4 && ( <h2>({stepIndex + 1}/4)</h2>)}

      {renderStep()}
      {stepIndex <90 && stepIndex > 0 && stepIndex !== 4 && (
        <div>
          <button onClick={handlePrevBtn}>Back</button>
          <button onClick={handleNextBtn}>{stepIndex === 3 ? 'Finish' : 'Next'}</button>
        </div>
      )}
    </div>
  );
}