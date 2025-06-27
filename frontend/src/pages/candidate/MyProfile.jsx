import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { candidateApi } from '../../services/api';

import PersonalInfoStep from './onboardingSteps/PersonalInfoStep';
import BasicInfoStep from './onboardingSteps/BasicInfoStep';
import SkillsStep from './onboardingSteps/SkillsStep';
import WorkExperienceStep from './onboardingSteps/WorkExperienceStep';
import EducationStep from './onboardingSteps/EducationStep';
import JobPreferenceStep from './onboardingSteps/JobPreferenceStep';
import PortfolioStep from './onboardingSteps/PortfolioStep';

export default function MyProfile() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [activeTab, setActiveTab] = useState('Personal');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await candidateApi.getProfileByUserId(userId);
        setFormData(response.data); 
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    fetchData();
  }, [userId]);

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: Array.isArray(prev[section]) ? data : { ...prev[section], ...data }
    }));
  };

  if (!formData) return <div>Loading profile...</div>;

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
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData('personalInfo', data)}
          />
        );
      case 'Basic':
        return (
          <BasicInfoStep
            data={formData.basicInfo}
            onUpdate={(data) => updateFormData('basicInfo', data)}
          />
        );
      case 'Skills':
        return (
          <SkillsStep
            data={formData.skills}
            onUpdate={(data) => updateFormData('skills', data)}
          />
        );
      case 'Work':
        return (
          <WorkExperienceStep
            data={formData.workHistory}
            onUpdate={(data) => updateFormData('workHistory', data)}
          />
        );
      case 'Education':
        return (
          <EducationStep
            data={formData.education}
            onUpdate={(data) => updateFormData('education', data)}
          />
        );
      case 'Job':
        return (
          <JobPreferenceStep
            data={formData.jobPreference}
            onUpdate={(data) => updateFormData('jobPreference', data)}
          />
        );
      case 'Portfolio':
        return (
          <PortfolioStep
            data={formData.portfolio}
            onUpdate={(data) => updateFormData('portfolio', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>My Profile</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {tabList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              padding: '0.5rem 1rem',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{renderTab()}</div>
    </div>
  );
}