

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

import {
  Box,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Container,
  Alert,
  AlertTitle
} from '@mui/material';

export default function MyProfile() {
  const { user } = useAuth();
  const userId = user?.userId;
  const profileId = user?.profileId;

  const [activeTab, setActiveTab] = useState('Personal');
  const [formData, setFormData] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('');
  const [verificationCompany, setVerificationCompany] = useState([]);

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

  // Debug state changes to verificationCompany
  useEffect(() => {
    console.log('Updated verificationCompany:', verificationCompany);
  }, [verificationCompany]);

  // Reset submit status on tab change
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

  const handleUpdate = async () => {
    try {
      await candidateApi.updateProfile(userId, formData);
      setSubmitStatus('success');
    } catch (err) {
      console.error('Failed to update profile:', err);
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
        return <PersonalInfoStep data={formData.personalInfo} onUpdate={(data) => updateFormData('personalInfo', data)} />;
      case 'Basic':
        return <BasicInfoStep data={formData.basicInfo} onUpdate={(data) => updateFormData('basicInfo', data)} />;
      case 'Skills':
        return <SkillsStep data={formData.skills} onUpdate={(data) => updateFormData('skills', data)} />;
      case 'Work':
        return <WorkExperienceStep data={formData.workHistory} onUpdate={(data) => updateFormData('workHistory', data)} verificationCompany={verificationCompany} />;
      case 'Education':
        return <EducationStep data={formData.education} onUpdate={(data) => updateFormData('education', data)} />;
      case 'Job':
        return <JobPreferenceStep data={formData.jobPreference} onUpdate={(data) => updateFormData('jobPreference', data)} />;
      case 'Portfolio':
        return <PortfolioStep data={formData.portfolio} onUpdate={(data) => updateFormData('portfolio', data)} />;
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

      {submitStatus === 'success' && (
        <Box mt={2}>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Your request has been submitted successfully.
          </Alert>
        </Box>
      )}

      {submitStatus === 'error' && (
        <Box mt={2}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Something went wrong. Please try again later.
          </Alert>
        </Box>
      )}
    </Container>
  );
}
