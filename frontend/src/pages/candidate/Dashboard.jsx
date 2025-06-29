import React from 'react'
import { useState, useEffect } from 'react';
import { candidateApi } from '../../services/api';
import ProfileSummary from './candidateDashboardItems/ProfileSummary';
import TrendingKeywordsSection from './candidateDashboardItems/TrendingKeywordsSection';
import InvitationsSection from './candidateDashboardItems/InvitationsSection';
import { useAuth } from '../../contexts/AuthContext';
import Allroles from '../../ScoringUtil/skillsFromJob'

export default function Dashboard() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [candidateName, setCandidateName] = useState("Name");
  const [profileScore, setProfileScore] = useState(0);
  const [profileView, setProfileView] = useState(40);
  const [desiredJobRole, setDesiredJobRole] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [alreadySkills, setAlreadySkills] = useState([]);

// console.log(Allroles)

  useEffect(() => {
    fetchProfileData();
  }, [])

  const fetchProfileData = async () => {
    try {
      const response = await candidateApi.getProfileByUserId(userId);
      const data = response.data;
      // console.log(data);
      setCandidateName(data.personalInfo.firstName);
      setProfileScore(data.profileScore);
      if (data.jobPreference?.desiredJobTitle?.length > 0) {
        setDesiredJobRole(data.jobPreference.desiredJobTitle[0]);
      } else {
        setDesiredJobRole("");
      }
      if (data.skills?.length > 0) {
        setAlreadySkills(data.skills.map(item => item.skill));
        // console.log("alreadySkills type:", typeof alreadySkills, Array.isArray(alreadySkills), alreadySkills);

      } else {
        setAlreadySkills([]);
      }
      // setProfileView(data.view);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (desiredJobRole) {
      const normalizedFetchedRole = desiredJobRole.toLowerCase(); 

      let matchedTemplate = null;

      for (const roleKey in Allroles) {
        if (Object.hasOwnProperty.call(Allroles, roleKey)) {
          const template = Allroles[roleKey];
          if (template.relevantTitles.includes(normalizedFetchedRole)) {
            matchedTemplate = template;
            break; 
          }
        }
      }
      // console.log(matchedTemplate)
      if (matchedTemplate) {
        setSuggestedSkills(matchedTemplate.requiredSkills);
                // console.log("Matching template found. Suggested Skills:", matchedTemplate.requiredSkills);

        // console.log(suggestedSkills)
      } else {
        setSuggestedSkills([]);
      }
    } else {
      setSuggestedSkills([]);
    }
  }, [desiredJobRole]);



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
      <ProfileSummary profileScore={profileScore}></ProfileSummary>
      <TrendingKeywordsSection suggestedSkills={suggestedSkills} alreadySkills={alreadySkills}></TrendingKeywordsSection>
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