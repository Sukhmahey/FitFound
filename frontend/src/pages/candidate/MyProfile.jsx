

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { candidateApi, jobVerificationApi } from '../../services/api';

import PersonalInfoStep from './onboardingSteps/PersonalInfoStep';
import BasicInfoStep from './onboardingSteps/BasicInfoStep';
import SkillsStep from './onboardingSteps/SkillsStep';
import WorkExperienceStep from './onboardingSteps/WorkExperienceStep';
import EducationStep from './onboardingSteps/EducationStep';
import JobPreferenceStep from './onboardingSteps/JobPreferenceStep';
import PortfolioStep from './onboardingSteps/PortfolioStep';
import useNotify from '../../utils/notificationService';

import {
  Box,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Container,
  Alert,
  AlertTitle,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

export default function MyProfile() {
  const { user } = useAuth();
  const notify = useNotify();
  const userId = user?.userId;
  const profileId = user?.profileId;

  const [activeTab, setActiveTab] = useState('Personal');
  const [formData, setFormData] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('');
  const [verificationCompany, setVerificationCompany] = useState([]);
  const [formErrors, setFormErrors] = useState({});
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  

      const handleSnackClose = () => setSnack({ ...snack, open: false });

  // Fetch candidate profile
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const response = await candidateApi.getProfileByUserId(userId);
        setFormData(response.data);
        console.log('Candidate Profile:', response.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchData();
  }, [userId]);

  // Fetch verification status
  useEffect(() => {
    if (!userId) return;

    const fetchVerificationData = async () => {
      try {
        const response = await jobVerificationApi.getVerificationStatus(profileId);
        console.log('Verification API Response:', response.data);

        const companyArray = response.data.map((company) => ({
          company: company?.employerProfileId?.companyName || 'Unknown',
          status: company.status,
        }));

        setVerificationCompany(companyArray);
      } catch (error) {
        console.error('Failed to load verification data:', error);
      }
    };

    fetchVerificationData();
  }, [userId]);

 

  useEffect(() => {
    setSubmitStatus('');

    const timer = setTimeout(() => {
      setSubmitStatus('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: Array.isArray(prev?.[section]) ? data : { ...prev?.[section], ...data },
    }));
  };

  const validateForm = () => {
  let errors = {};
  if (activeTab === 'Personal') {
    const { firstName, lastName } = formData.personalInfo || {};
    if (!firstName?.trim()) errors.firstName = "First name is required";
    if (!lastName?.trim()) errors.lastName = "Last name is required";
  }

  if (activeTab === 'Basic') {
    const { phoneNumber } = formData.basicInfo || {};
    if (!phoneNumber?.trim()) errors.phoneNumber = "Phone number is required";
  }

  if (activeTab === 'Skills') {
    if ((formData.skills || []).length === 0) errors.skills = "Add at least one skill";
  }

  if (activeTab === 'Work') {
    (formData.workHistory || []).forEach((exp, i) => {
      if (!exp.companyName) errors[`companyName_${i}`] = "Company name is required";
      if (!exp.jobTitle) errors[`jobTitle_${i}`] = "Job title is required";
      if (!exp.startDate) errors[`startDate_${i}`] = "Start Date is required";
      if (!exp.endDate) errors[`endDate_${i}`] = "End Date is required";
      if (!exp.experienceLevel) errors[`experienceLevel_${i}`] = "Experience Level is required";
    });
  }

  if (activeTab === 'Job') {
    const desired = formData.jobPreference?.desiredJobTitle;
    const jobType = formData.jobPreference?.jobType;
    if (!desired || desired.length === 0 || !desired[0]?.trim()) {
      errors.selectedRole = "Desired Role is required";
    }
    if (!jobType?.trim()) errors.jobType = "Job type is required";
  }

  return errors;
};

  const handleUpdate = async () => {
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    const messages = Object.values(errors); 
 
    const messageText = messages.join(', ');
    setSnack({ open: true, message: `Please fix: ${messageText}`, severity: 'error' });
    return;
  }

  setFormErrors({});
  try {
    await candidateApi.updateProfile(userId, formData);
    setSubmitStatus('success');
    await notify.success("Profile saved successfully!");
  } catch (err) {
    console.error('Failed to update profile:', err);
    await notify.error("Failed to update profile");
    setSubmitStatus('error');
  }
};

  if (!formData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const tabList = [
    'Personal',
    'Basic',
    'Skills',
    'Work',
    'Education',
    'Job',
    'Portfolio'
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'Personal':
        return <PersonalInfoStep data={formData.personalInfo} onUpdate={(data) => updateFormData('personalInfo', data)} errors={formErrors}/>;
      case 'Basic':
        return <BasicInfoStep data={formData.basicInfo} onUpdate={(data) => updateFormData('basicInfo', data)} errors={formErrors}/>;
      case 'Skills':
        return <SkillsStep data={formData.skills} onUpdate={(data) => updateFormData('skills', data)} errors={formErrors}/>;
      case 'Work':
        return <WorkExperienceStep data={formData.workHistory} onUpdate={(data) => updateFormData('workHistory', data)} verificationCompany={verificationCompany} errors={formErrors}/>;
      case 'Education':
        return <EducationStep data={formData.education} onUpdate={(data) => updateFormData('education', data)} errors={formErrors}/>;
      case 'Job':
        return <JobPreferenceStep data={formData.jobPreference} onUpdate={(data) => updateFormData('jobPreference', data)} errors={formErrors}/>;
      case 'Portfolio':
        return <PortfolioStep data={formData.portfolio} onUpdate={(data) => updateFormData('portfolio', data)} errors={formErrors}/>;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={3}>
        <h2>My Profile</h2>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabList.map((tab) => (
          <Tab key={tab} value={tab} label={tab} />
        ))}
      </Tabs>

      <Box mt={3}>{renderTab()}</Box>

      <Box mt={4} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Profile
        </Button>
      </Box>

      <Box>
        <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <MuiAlert severity={snack.severity} onClose={handleSnackClose}>
            {snack.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Container>
  );
}
