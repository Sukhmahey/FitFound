import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { candidateApi } from '../../services/api';
import ProfileSummary from './candidateDashboardItems/ProfileSummary';
import TrendingKeywordsSection from './candidateDashboardItems/TrendingKeywordsSection';
import InvitationsSection from './candidateDashboardItems/InvitationsSection';
import { useAuth } from '../../contexts/AuthContext';
import Allroles from '../../ScoringUtil/skillsFromJob'
import { Container } from '@mui/material'
import useNotify from '../../utils/notificationService';

export default function Dashboard() {
  const { user } = useAuth();
  const userId = user?.userId;
  const profileId = user?.profileId;
  const notify = useNotify();

  const [candidateName, setCandidateName] = useState("Name");
  const [profileScore, setProfileScore] = useState(0);
  const [profileView, setProfileView] = useState(40);
  const [desiredJobRole, setDesiredJobRole] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [alreadySkills, setAlreadySkills] = useState([]);
  const [invitationCount, setInvitationCount] = useState(0);
  const [workHistory, setWorkHistory] = useState([]);

  // console.log(Allroles)

  useEffect(() => {
    fetchProfileData();
  }, [])



  const hasFetchedProfile = useRef(false);
  useEffect(() => {
    if (workHistory.length > 0) {
      hasFetchedProfile.current = true;
    }
  }, [workHistory]);

  const fetchProfileData = async () => {
    try {
      const response = await candidateApi.getProfileByUserId(userId);
      const data = response.data;
      // console.log(data);
      setCandidateName(data.personalInfo.firstName);
      setWorkHistory(await data.workHistory);
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
  const notifiedHires = useRef(new Set());
  useEffect(() => {
    console.log(workHistory);
    const fetchHiringNotifications = async () => {
      try {
        const res = await candidateApi.fetchInteractions(profileId);

        const hired = res.data.filter(i => i.finalStatus === 'hired');

        const workCompanies = workHistory.map(w => w.companyName.toLowerCase());

        const newHires = hired.filter(i => {
          const companyName = i.employerId?.companyName?.toLowerCase() || '';

          return !workCompanies.includes(companyName) && !notifiedHires.current.has(i._id);
        });

        newHires.forEach(hire => {
          notify.success(`🎉 You've been hired at ${hire.employerId?.companyName || "a company"}!`);

          notifiedHires.current.add(hire._id);
        });

      } catch (err) {
        console.error("Error fetching hiring notifications", err);
      }
    };

    if (hasFetchedProfile.current && workHistory.length >= 0) {
      fetchHiringNotifications();
    }
  }, [workHistory]);

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





  return (
    <Container maxWidth="md" sx={{ mt: 4 }} >     <h1>Dashboard</h1>
      <h2> Hello 👋, {candidateName}</h2>
      <ProfileSummary profileScore={profileScore} invitationCount={invitationCount}></ProfileSummary>
      <TrendingKeywordsSection suggestedSkills={suggestedSkills} alreadySkills={alreadySkills}></TrendingKeywordsSection>
      <InvitationsSection setInvitationCount={setInvitationCount}></InvitationsSection>

      <div >
      </div>
    </Container>
  )
}

