import React from 'react'
import { useState, useEffect } from 'react';
import { candidateApi } from '../../services/api';
import ProfileSummary from './candidateDashboardItems/ProfileSummary';
import TrendingKeywordsSection from './candidateDashboardItems/TrendingKeywordsSection';
import InvitationsSection from './candidateDashboardItems/InvitationsSection';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [candidateName, setCandidateName] = useState("Name");
  const [profileScore, setProfileScore] = useState(90);
  const [profileView, setProfileView] = useState(40);



  useEffect(() => {
    fetchProfileData();
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await candidateApi.getProfileByUserId(userId);
      const data = response.data;
      // console.log(data);
      setCandidateName(data.personalInfo.firstName);
      // setProfileScore(data.score);
      // setProfileView(data.view);

    } catch (error) {
      console.error(error);
    }
  }

  const dummyProfile = {
    name: candidateName,
    score: profileScore,
    interviews: [
      { jobTitle: 'Frontend Developer', company: 'Shopify', status: 'Scheduled', date: '2025-06-10' },
      { jobTitle: 'FullStack Developer', company: 'RBC', status: 'Pending', date: 'TBD' },
    ],
    suggestions: [
      'Add React.js to your skills', 'Mention project experience'
    ]
  }

  return (
    <div style={styles.outerCard}>
      <h1>Dashboard</h1>
      <h2> Hello 👋, {dummyProfile.name}</h2>
      <ProfileSummary></ProfileSummary>
      <TrendingKeywordsSection></TrendingKeywordsSection>
      <InvitationsSection></InvitationsSection>

      <div >
      </div>
    </div>
  )
}

const styles = {
  outerCard: {
    width: '90vw',
    margin: 'auto',

  }
}