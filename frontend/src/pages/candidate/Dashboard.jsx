// CandidateDashboard.jsx

import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { candidateApi } from "../../services/api";
import useNotify from "../../utils/notificationService";
import Allroles from "../../ScoringUtil/skillsFromJob";
import TrendingKeywordsSection from "./candidateDashboardItems/TrendingKeywordsSection";
import InvitationsSection from "./candidateDashboardItems/InvitationsSection";

const primaryColor = "#062F54";
const cardColors = ["#E3F2FD", "#FCE4EC", "#FFF3E0", "#E8F5E9", "#F3E5F5"];

export default function CandidateDashboard() {
  const { user } = useAuth();
  const userId = user?.userId;
  const profileId = user?.profileId;
  const notify = useNotify();

  const [candidateName, setCandidateName] = useState("Candidate");
  const [profileScore, setProfileScore] = useState(0);
  const [profileView, setProfileView] = useState(0);
  const [desiredJobRole, setDesiredJobRole] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [alreadySkills, setAlreadySkills] = useState([]);
  const [invitationCount, setInvitationCount] = useState(0);
  const [workHistory, setWorkHistory] = useState([]);

  const hasFetchedProfile = useRef(false);
  const notifiedHires = useRef(new Set());

  useEffect(() => {
    fetchProfileData();
    fetchAppearance();
  }, []);

  useEffect(() => {
    if (workHistory.length > 0) hasFetchedProfile.current = true;
  }, [workHistory]);

  useEffect(() => {
    if (hasFetchedProfile.current) fetchHiringNotifications();
  }, [workHistory]);

  useEffect(() => {
    if (desiredJobRole) {
      const roleKey = desiredJobRole.toLowerCase();
      const template = Object.values(Allroles).find((tpl) =>
        tpl.relevantTitles.includes(roleKey)
      );
      setSuggestedSkills(template?.requiredSkills || []);
    }
  }, [desiredJobRole]);

  const fetchAppearance = async () => {
    try {
      const res = await candidateApi.getAppearanceCount(profileId);
      const views = res.data.reduce((acc, cur) => acc + cur.appearances, 0);
      setProfileView(views);
    } catch (err) {
      console.error("Appearance Error", err);
    }
  };

  const fetchProfileData = async () => {
    try {
      const res = await candidateApi.getProfileByUserId(userId);
      const data = res.data;
      setCandidateName(data.personalInfo?.firstName || "Candidate");
      setWorkHistory(data.workHistory || []);
      setProfileScore(data.profileScore || 0);
      setAlreadySkills(data.skills?.map((s) => s.skill) || []);
      if (data.jobPreference?.desiredJobTitle?.length)
        setDesiredJobRole(data.jobPreference.desiredJobTitle[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHiringNotifications = async () => {
    try {
      const res = await candidateApi.fetchInteractions(profileId);
      const hired = res.data.filter((i) => i.finalStatus === "hired");
      const companies = workHistory.map((w) => w.companyName.toLowerCase());

      hired.forEach((h) => {
        const name = h.employerId?.companyName?.toLowerCase();
        if (!companies.includes(name) && !notifiedHires.current.has(h._id)) {
          notify.success(
            `🎉 You've been hired at ${
              h.employerId?.companyName || "a company"
            }!`
          );
          notifiedHires.current.add(h._id);
        }
      });
    } catch (err) {
      console.error("Hiring Notification Error", err);
    }
  };

  const InfoCard = ({ label, value, icon, color }) => (
    <Paper
      elevation={3}
      sx={{
        flex: 1,
        minWidth: 150,
        p: 3,
        borderRadius: 3,
        backgroundColor: color,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar
        sx={{
          bgcolor: primaryColor,
          width: 48,
          height: 48,
          mb: 1,
        }}
      >
        {icon}
      </Avatar>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          color: primaryColor,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Figtree, sans-serif",
          fontSize: 14,
          color: "#444",
        }}
      >
        {label}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          color: primaryColor,
        }}
      >
        Welcome, {candidateName} 👋
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
        <InfoCard
          label="Profile Score"
          value={`${profileScore}%`}
          icon="📊"
          color={cardColors[0]}
        />
        <InfoCard
          label="Views"
          value={profileView}
          icon="👀"
          color={cardColors[1]}
        />
        <InfoCard
          label="Invitations"
          value={invitationCount}
          icon="✉️"
          color={cardColors[2]}
        />
      </Box>

      <TrendingKeywordsSection
        suggestedSkills={suggestedSkills}
        alreadySkills={alreadySkills}
      />

      <Box sx={{ mt: 4 }}>
        <InvitationsSection setInvitationCount={setInvitationCount} />
      </Box>
    </Container>
  );
}
