import React, { useState } from 'react';
import {
  Stepper, Step, StepLabel, Container, Box, Button, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { candidateApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import useNotify from '../../../utils/notificationService';

import PersonalInfoStep from './PersonalInfoStep';
import BasicInfoStep from './BasicInfoStep';
import SkillsStep from './SkillsStep';
import WorkExperienceStep from './WorkExperienceStep';
import PortfolioStep from './PortfolioStep';
import EducationStep from './EducationStep';
import JobPreferenceStep from './JobPreferenceStep';

export default function InfoConfirmationPage({ data }) {
  const { user } = useAuth();
  const userId = user?.userId;
  const userEmail = user?.email;
  const navigate = useNavigate();
  const notify = useNotify();

  const [stepIndex, setStepIndex] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState(data);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const steps = [
    'Personal Info',
    'Basic Info',
    'Skills',
    'Work Experience',
    'Portfolio',
    'Education',
    'Job Preference'
  ];

  const handleSnackClose = () => setSnack({ ...snack, open: false });

  const updateFormData = (section, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section]) ? value : { ...prev[section], ...value }
    }));
  };
  console.log(formData);


  const validateStep = () => {
  let errors = {};
  if (stepIndex === 0) {
    const { firstName, lastName } = formData.personalInfo;
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
  }

  if (stepIndex === 1) {
    const { phoneNumber } = formData.basicInfo;
    if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  }

  if (stepIndex === 2) {
    if (formData.skills.length === 0) errors.skills = "Add at least one skill";
  }

  if (stepIndex === 3) {
    formData.workExperience.forEach((exp, i) => {
      if (!exp.companyName) errors[`companyName_${i}`] = "Company name is required";
      if (!exp.jobTitle) errors[`jobTitle_${i}`] = "Job title is required";
      if (!exp.startDate) errors[`startDate_${i}`] = "Start Date is required";
      if (!exp.endDate) errors[`endDate_${i}`] = "End Date is required";
      if (!exp.experienceLevel) errors[`experienceLevel_${i}`] = "Experience Level is required";
    });
  }

  if (stepIndex === 6) {
    const desired = formData.jobPreference.desiredJobTitle;
    const jobType = formData.jobPreference.jobType;
    if (!desired || desired.length === 0 || !desired[0]?.trim()) {
      errors.selectedRole = "Desired Role is required";
    }
    if (!jobType.trim()) errors.jobType = "Job type is required";
  }

  return errors;
};

  const handleNext = async () => {
    const errors = validateStep();
if (Object.keys(errors).length > 0) {
  setFormErrors(errors);
  const messages = Object.values(errors); 
  const messageText = messages.join(', ');
  setSnack({ open: true, message: `Please fix: ${messageText}`, severity: 'error' });
  return;
}
setFormErrors({});
    try {
   const formatDate = (date) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    return `${year}-${month}`;
  };
      if (stepIndex === 0) await candidateApi.updatePersonalInfo(userId, formData.personalInfo);
      if (stepIndex === 1) await candidateApi.updateBasicInfo(userId, formData.basicInfo);
      if (stepIndex === 2) await candidateApi.updateSkills(userId, {
        skills: formData.skills.map(s => ({ skill: s.skill?.trim() || s }))
      });
      if (stepIndex === 3) {
        await candidateApi.updateWorkHistory(userId, {
          workHistory: formData.workExperience.map(w => ({
            ...w,
            startDate: formatDate(w.startDate),
            endDate: formatDate(w.endDate),
            achievements: w.achievements?.filter(a => a.trim())
          }))
        });
      }
      if (stepIndex === 4) await candidateApi.updatePortfolio(userId, formData.portfolio);
      if (stepIndex === 5) {
        await candidateApi.updateEducation(userId, {
          education: formData.education.map(e => ({
            ...e,
            startDate: formatDate(e.startDate),
            endDate: formatDate(e.endDate)
          }))
        });
      }
      if (stepIndex === 6) {
        await candidateApi.updateJobPreference(userId, formData.jobPreference);
        notify.success('Profile updated!');
        navigate('/candidate/dashboard');
        return;
      }

      setStepIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error saving step:', err);
      setSnack({ open: true, message: 'Failed to save this step.', severity: 'error' });
    }
  };

  const handleBack = () => setStepIndex(prev => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (stepIndex) {
      case 0: return <PersonalInfoStep data={formData.personalInfo} onUpdate={d => updateFormData('personalInfo', d)} userEmail={userEmail} errors={formErrors}/>;
      case 1: return <BasicInfoStep data={formData.basicInfo} onUpdate={d => updateFormData('basicInfo', d)} errors={formErrors}/>;
      case 2: return <SkillsStep data={formData.skills} onUpdate={d => updateFormData('skills', d)} errors={formErrors}/>;
      case 3: return <WorkExperienceStep data={formData.workExperience} onUpdate={d => updateFormData('workExperience', d)} errors={formErrors}/>;
      case 4: return <PortfolioStep data={formData.portfolio} onUpdate={d => updateFormData('portfolio', d)} errors={formErrors} />;
      case 5: return <EducationStep data={formData.education} onUpdate={d => updateFormData('education', d)} errors={formErrors} />;
      case 6: return <JobPreferenceStep data={formData.jobPreference} onUpdate={d => updateFormData('jobPreference', d)} errors={formErrors} />;
      default: return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <MuiAlert severity={snack.severity} onClose={handleSnackClose}>
          {snack.message}
        </MuiAlert>
      </Snackbar>

      <Stepper activeStep={stepIndex} alternativeLabel sx={{ mb: 4 }}>
        {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      {renderStep()}

      <Box mt={5} display="flex" justifyContent="space-between">
        <Button disabled={stepIndex === 0} onClick={handleBack}>Back</Button>
        <Button onClick={handleNext}>{stepIndex === 6 ? 'Finish' : 'Next'}</Button>
      </Box>
    </Container>
  );
}
