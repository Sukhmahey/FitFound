// import React, { useState } from 'react';
// import { candidateApi } from '../../services/api';
// import { useAuth } from '../../contexts/AuthContext';

// import PersonalInfoStep from './onboardingSteps/PersonalInfoStep';
// import EducationSkillsStep from './onboardingSteps/EducationSkillsStep';
// import WorkExperienceStep from './onboardingSteps/WorkExperienceStep';
// import ProfileSetupOption from './onboardingSteps/ProfileSetupOption';
// import ResumeParsing from './onboardingSteps/ResumeParsing';
// import InfoConfirmationPage from './onboardingSteps/InfoConfirmationPage';

// import BasicInfoStep from './onboardingSteps/BasicInfoStep';
// import PortfolioStep from './onboardingSteps/PortfolioStep';
// import JobPreferenceStep from './onboardingSteps/JobPreferenceStep';
// import SkillsStep from './onboardingSteps/SkillsStep';
// import EducationStep from './onboardingSteps/EducationStep';

// export default function CandidateOnboarding() {
//   const { user } = useAuth();
//   const userId = user?.userId;

//   const [stepIndex, setStepIndex] = useState(0);
//   const [confirmedData, setConfirmedData] = useState(null);
//   const [formData, setFormData] = useState({
//         personalInfo: {
//       firstName: '',
//       middleName: '',
//       lastName: '',
//       email: '',
//       currentStatus: '',
//       specialization: ''
//     },
//     basicInfo: {
//       phoneNumber: '',
//       workStatus: '',
//       languages: '',
//       bio: '',
//       additionalInfo: ''
//     },
//     skills: [],
//         portfolio: {
//       linkedin: '',
//       website: '',
//       additional: ''
//     },
//     education: [],
//     jobPreference: {
//       desiredTitles: [],
//       jobType: '',
//       salaryExpectation: ''
//     }
//   });

//   const handleManual = () => {
//     console.log("Manual form selected");
//     setStepIndex(1);
//   };

//   const handleUpload = () => {
//     console.log("Resume upload selected");
//     setStepIndex(4);
//   };

//   const convertMonthFormat = (value) => {
//   if (!value || !value.includes("-")) return value;
//   const [year, month] = value.split("-");
//   return `${month}-${year}`;
// };



//   const handleNextBtn = async () => {
//     const cleanedPersonalInfo = {
//       ...formData.personalInfo,
//       salary: Number(formData.personalInfo.salary),
//       yearsOfExperience: Number(formData.personalInfo.yearsOfExperience),
//       preferredRole: formData.personalInfo.prefferedRole,
//     };
//     delete cleanedPersonalInfo.prefferedRole;

//     const educationData = [{
//       degree: formData.educationSkills.degree,
//       field: formData.educationSkills.field,
//       gradYear: formData.educationSkills.gradYear,
//       institution: formData.educationSkills.institution
//     }];

//     const skillsData = formData.educationSkills.skills
//       ? formData.educationSkills.skills.split(',').map(skill => ({ skill: skill.trim() }))
//       : [];

    
// const cleanedWorkExperience = formData.workExperience.map(item => ({
//   ...item,
//   startDate: convertMonthFormat(item.startDate),
//   endDate: convertMonthFormat(item.endDate),
//   achievements: item.achievements
//     ? item.achievements.split(',').map(a => a.trim())
//     : [],
//   technologiesUsed: item.technologiesUsed
//     ? item.technologiesUsed.split(',').map(t => t.trim())
//     : []
// }));



//     try {
//       if (stepIndex === 1) {
//         await candidateApi.updateProfile(userId, cleanedPersonalInfo);
//         setStepIndex(2);
//       } else if (stepIndex === 2) {
//         await candidateApi.updateWorkHistory(userId, { workHistory: cleanedWorkExperience });
//         setStepIndex(3);
//       } else if (stepIndex === 3) {
//         await candidateApi.updateEducation(userId, { education: educationData });
//         await candidateApi.updateSkills(userId, { skills: skillsData });
//         alert("Profile saved successfully!");
//       } else if (stepIndex === 0) {
        
//         setStepIndex(1);
//       }
      
//     } catch (err) {
//       console.error("Failed to submit:", err);
//       alert("Submission failed.");
//     }
//   };

//   const handlePrevBtn = () => {
//     if (stepIndex > 0 && stepIndex < 4) {
//       setStepIndex(stepIndex - 1);
//     }
//   };

//   const updateFormData = (section, data) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: Array.isArray(prev[section]) ? data : {
//         ...prev[section],
//         ...data
//       }
//     }));
//   };

//   const renderStep = () => {
//     switch (stepIndex) {
//       case 0:
//         return <ProfileSetupOption onManualClick={handleManual} onUploadClick={handleUpload} />;
//       case 1:
//         return <PersonalInfoStep data={formData.personalInfo} onUpdate={(data) => updateFormData('personalInfo', data)} />;
//       case 2:
//         // return <WorkExperienceStep data={formData.workExperience} onUpdate={(data) => updateFormData('workExperience', data)} />;
//         return <BasicInfoStep data={formData.basicInfo} onUpdate={(data) => updateFormData('basicInfo', data)} />;
//       case 3:
//         // return <EducationSkillsStep data={formData.educationSkills} onUpdate={(data) => updateFormData('educationSkills', data)} />;
//         return <SkillsStep data={formData.skills} onUpdate={(data) => updateFormData('skills', data)} />;
//       case 4:
//         return <ResumeParsing setStep={setStepIndex} setConfirmedData={setConfirmedData}/>;
//       case 5:
//         return <WorkExperienceStep data={formData.workExperience} onUpdate={(data) => updateFormData('workExperience', data)}/>;
//       case 6:
//         return <PortfolioStep data={formData.portfolioLinks} onUpdate={(data) => updateFormData('portfolioLinks', data)}/>;
//       case 7:
//         return <EducationStep data={formData.education} onUpdate={(data) => updateFormData('education', data)}/>;
//       case 8:
//         return <JobPreferenceStep data={formData.jobPreference} onUpdate={(data) => updateFormData('jobPreference', data)}/>;

//       case 99:
//         return <InfoConfirmationPage data={confirmedData}></InfoConfirmationPage>
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <div>Onboarding</div>
//       {stepIndex <90 && stepIndex !== 4 && ( <h2>({stepIndex + 1}/4)</h2>)}

//       {renderStep()}
//       {stepIndex <90 && stepIndex > 0 && stepIndex !== 4 && (
//         <div>
//           <button onClick={handlePrevBtn}>Back</button>
//           <button onClick={handleNextBtn}>{stepIndex === 3 ? 'Finish' : 'Next'}</button>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useState } from 'react';
// import { candidateApi } from '../../services/api';
// import { useAuth } from '../../contexts/AuthContext';

// import PersonalInfoStep from './onboardingSteps/PersonalInfoStep';
// import BasicInfoStep from './onboardingSteps/BasicInfoStep';
// import SkillsStep from './onboardingSteps/SkillsStep';
// import WorkExperienceStep from './onboardingSteps/WorkExperienceStep';
// import PortfolioStep from './onboardingSteps/PortfolioStep';
// import EducationStep from './onboardingSteps/EducationStep';
// import JobPreferenceStep from './onboardingSteps/JobPreferenceStep';
// import ProfileSetupOption from './onboardingSteps/ProfileSetupOption';
// import ResumeParsing from './onboardingSteps/ResumeParsing';
// import InfoConfirmationPage from './onboardingSteps/InfoConfirmationPage';

// export default function Onboarding() {
//   const { user } = useAuth();
//   const userId = user?.userId;

//   const [stepIndex, setStepIndex] = useState(0);
//   const [confirmedData, setConfirmedData] = useState(null);
//   const [formData, setFormData] = useState({
//     personalInfo: {
//       firstName: '',
//       middleName: '',
//       lastName: '',
//       email: '',
//       currentStatus: '',
//       specialization: ''
//     },
//     basicInfo: {
//       phoneNumber: '',
//       workStatus: '',
//       languages: '',
//       bio: '',
//       additionalInfo: ''
//     },
//     skills: [],
//     workExperience: [],
//     portfolio: {
//       linkedin: '',
//       website: '',
//       additional: ''
//     },
//     education: {
//       institution: '',
//       credentials: '',
//       startDate: '',
//       endDate: ''
//     },
//     jobPreference: {
//       desiredTitles: [],
//       jobType: '',
//       salaryExpectation: ''
//     }
//   });

//   const handleManual = () => setStepIndex(1);
//   const handleUpload = () => setStepIndex(4);

//   const convertMonthFormat = (value) => {
//     if (!value || !value.includes("-")) return value;
//     const [year, month] = value.split("-");
//     return `${month}-${year}`;
//   };

//   const handleNextBtn = async () => {
//     try {
//       switch (stepIndex) {
//         case 1:
//           await candidateApi.updateProfile(userId, formData.personalInfo);
//           break;
//         case 2:
//           await candidateApi.updateBasicInfo(userId, formData.basicInfo);
//           break;
//         case 3:
//           await candidateApi.updateSkills(userId, { skills: formData.skills.map(skill => ({ skill })) });
//           break;
//         case 5:
//           await candidateApi.updateWorkHistory(userId, { workHistory: formData.workExperience });
//           break;
//         case 6:
//           await candidateApi.updatePortfolio(userId, formData.portfolio);
//           break;
//         case 7:
//           await candidateApi.updateEducation(userId, { education: [formData.education] });
//           break;
//         case 8:
//           await candidateApi.updateJobPreference(userId, formData.jobPreference);
//           alert("Profile saved successfully!");
//           break;
//         default:
//           break;
//       }
//       if (stepIndex === 0) setStepIndex(1);
//       else setStepIndex(stepIndex + 1);
//     } catch (err) {
//       console.error("Failed to submit:", err);
//       alert("Submission failed.");
//     }
//   };

//   const handlePrevBtn = () => {
//     if (stepIndex > 0 && stepIndex < 90) setStepIndex(stepIndex - 1);
//   };

//   const updateFormData = (section, data) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: Array.isArray(prev[section]) ? data : { ...prev[section], ...data }
//     }));
//   };

//   const renderStep = () => {
//     switch (stepIndex) {
//       case 0:
//         return <ProfileSetupOption onManualClick={handleManual} onUploadClick={handleUpload} />;
//       case 1:
//         return <PersonalInfoStep data={formData.personalInfo} onUpdate={data => updateFormData('personalInfo', data)} />;
//       case 2:
//         return <BasicInfoStep data={formData.basicInfo} onUpdate={data => updateFormData('basicInfo', data)} />;
//       case 3:
//         return <SkillsStep data={formData.skills} onUpdate={data => updateFormData('skills', data)} />;
//       case 4:
//         return <ResumeParsing setStep={setStepIndex} setConfirmedData={setConfirmedData}/>;
//       case 5:
//         return <WorkExperienceStep data={formData.workExperience} onUpdate={data => updateFormData('workExperience', data)} />;
//       case 6:
//         return <PortfolioStep data={formData.portfolio} onUpdate={data => updateFormData('portfolio', data)} />;
//       case 7:
//         return <EducationStep data={formData.education} onUpdate={data => updateFormData('education', data)} />;
//       case 8:
//         return <JobPreferenceStep data={formData.jobPreference} onUpdate={data => updateFormData('jobPreference', data)} />;
//       case 99:
//         return <InfoConfirmationPage data={confirmedData} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <div>Onboarding</div>
//       {stepIndex < 90 && stepIndex !== 4 && <h2>({stepIndex + 1}/9)</h2>}

//       {renderStep()}

//       {stepIndex < 90 && stepIndex > 0 && stepIndex !== 4 && (
//         <div>
//           <button onClick={handlePrevBtn}>Back</button>
//           <button onClick={handleNextBtn}>{stepIndex === 8 ? 'Finish' : 'Next'}</button>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState } from 'react';
import { candidateApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

import PersonalInfoStep from './onboardingSteps/PersonalInfoStep';
import BasicInfoStep from './onboardingSteps/BasicInfoStep';
import SkillsStep from './onboardingSteps/SkillsStep';
import ResumeParsing from './onboardingSteps/ResumeParsing';
import WorkExperienceStep from './onboardingSteps/WorkExperienceStep';
import PortfolioStep from './onboardingSteps/PortfolioStep';
import EducationStep from './onboardingSteps/EducationStep';
import JobPreferenceStep from './onboardingSteps/JobPreferenceStep';
import ProfileSetupOption from './onboardingSteps/ProfileSetupOption';
import InfoConfirmationPage from './onboardingSteps/InfoConfirmationPage';

export default function CandidateOnboarding() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [stepIndex, setStepIndex] = useState(0);
  const [confirmedData, setConfirmedData] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      currentStatus: '',
      specialization: ''
    },
    basicInfo: {
      phoneNumber: '',
      workStatus: '',
      language: '',
      bio: '',
      additionalInfo: ''
    },
    skills: [],
    workExperience: [],
    portfolio: {
      socialLinks: {
        linkedin: '',
        personalPortfolioWebsite: '',
        additionalLinks: []
      }
    },
    education: [],
    jobPreference: {
      desiredJobTitle: [],
      jobType: '',
      salaryExpectation: {
        min: 0,
        perHour: false,
        perYear: false
      }
    }
  });

  const handleManual = () => setStepIndex(1);
  const handleUpload = () => setStepIndex(4);

  const convertMonthFormat = (value) => {
    if (!value || !value.includes("-")) return value;
    const [year, month] = value.split("-");
    return `${month}-${year}`;
  };

  const handleNextBtn = async () => {
    try {
      if (stepIndex === 1) {
        await candidateApi.updatePersonalInfo(userId, formData.personalInfo);
        setStepIndex(2);
      } else if (stepIndex === 2) {
        await candidateApi.updateBasicInfo(userId, formData.basicInfo);
        setStepIndex(3);
      } else if (stepIndex === 3) {
        const cleanedSkills = formData.skills.map(skill => ({ skill: skill.skill?.trim?.() || '' }));
        await candidateApi.updateSkills(userId, { skills: cleanedSkills });
        setStepIndex(4);
      } else if (stepIndex === 14) {
        setStepIndex(99); 
      } else if (stepIndex === 5) {
        const cleanedExperience = formData.workExperience.map(item => ({
          ...item,
          startDate: convertMonthFormat(item.startDate),
          endDate: convertMonthFormat(item.endDate),
          achievements: item.achievements?.filter(a => a.trim()) || []
        }));
        await candidateApi.updateWorkHistory(userId, { workHistory: cleanedExperience });
        setStepIndex(6);
      } else if (stepIndex === 6) {
        await candidateApi.updatePortfolio(userId, {
          socialLinks: formData.portfolio.socialLinks
        });
        setStepIndex(7);
      } else if (stepIndex === 7) {
        const cleanedEducation = formData.education.map(item => ({
          ...item,
          startDate: convertMonthFormat(item.startDate),
          endDate: convertMonthFormat(item.endDate)
        }));
        await candidateApi.updateEducation(userId, { education: cleanedEducation });
        setStepIndex(8);
      } else if (stepIndex === 8) {
        await candidateApi.updateJobPreference(userId, formData.jobPreference);
        alert("Profile saved successfully!");
        // setStepIndex(99);
      } else {
        setStepIndex(stepIndex + 1);
      }
    } catch (err) {
      console.error("Failed to submit:", err);
      alert("Submission failed.");
    }
  };

  const handlePrevBtn = () => {
    if (stepIndex > 0 && stepIndex < 99) setStepIndex(stepIndex - 1);
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
        return <BasicInfoStep data={formData.basicInfo} onUpdate={(data) => updateFormData('basicInfo', data)} />;
      case 3:
        return <SkillsStep data={formData.skills} onUpdate={(data) => updateFormData('skills', data)} />;
      case 14:
        return <ResumeParsing setStep={setStepIndex} setConfirmedData={setConfirmedData} />;
      case 5:
        return <WorkExperienceStep data={formData.workExperience} onUpdate={(data) => updateFormData('workExperience', data)} />;
      case 6:
        return <PortfolioStep data={formData.portfolio} onUpdate={(data) => updateFormData('portfolio', data)} />;
      case 7:
        return <EducationStep data={formData.education} onUpdate={(data) => updateFormData('education', data)} />;
      case 8:
        return <JobPreferenceStep data={formData.jobPreference} onUpdate={(data) => updateFormData('jobPreference', data)} />;
        
      case 99:
        return <InfoConfirmationPage data={confirmedData} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>Onboarding</div>
      {stepIndex < 90 && stepIndex !== 14 && (<h2>({stepIndex + 1}/9)</h2>)}
      {renderStep()}
      {stepIndex < 90 && stepIndex > 0 && stepIndex !== 14 && (
        <div>
          <button onClick={handlePrevBtn}>Back</button>
          <button onClick={handleNextBtn}>{stepIndex === 8 ? 'Finish' : 'Next'}</button>
        </div>
      )}
    </div>
  );
}
