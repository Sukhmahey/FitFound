import React from 'react'
import { useState } from 'react'
import ProfileSummary from './candidateDashboardItems/ProfileSummary';
import TrendingKeywordsSection from './candidateDashboardItems/TrendingKeywordsSection';
import InvitationsSection from './candidateDashboardItems/InvitationsSection';

export default function Dashboard() {

    const [profileScore , setProfileScore] = useState(90);
    const [profileView , setProfileView] = useState(40);

    const dummyProfile = {
        name:"nikki",
        score : profileScore,
        interviews: [
            {jobTitle: 'Frontend Developer', company: 'Shopify', status: 'Scheduled', date: '2025-06-10'},
            { jobTitle: 'FullStack Developer', company: 'RBC', status: 'Pending', date: 'TBD' },
        ],
        suggestions: [
            'Add React.js to your skills', 'Mention project experience'
        ]
    }

  return(
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
  outerCard:{
    width: '90vw',
    margin: 'auto',
    
  }
}