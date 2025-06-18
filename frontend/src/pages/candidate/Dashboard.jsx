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

  // return (
  //   <div style={{marginLeft: 'auto', marginRight: 'auto', width: '80%'}}>
  //       <h1>Dashboard</h1>
  //       <h2> Hello 👋, {dummyProfile.name}</h2>

  //       <div style={{ marginBottom: '20px' }}>
  //       <h4>Profile Completion</h4>
  //       <div style={{ background: '#eee', borderRadius: '10px', overflow: 'hidden', width: '300px' }}>
  //         <div
  //           style={{
  //             width: `${dummyProfile.score}%`,
  //             background: '#4caf50',
  //             height: '20px',
  //           }}
  //         />
  //       </div>
  //       <p>{dummyProfile.score}% complete</p>
  //     </div>

  //     <div style={{ marginBottom: '20px' }}>
  //       <h4>Profile Views</h4>
  //       <p>{profileView} views this week</p>
  //     </div>

  //     <div style={{ marginBottom: '20px' }}>
  //       <h4>Interviews</h4>
  //       <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
  //         <thead>
  //           <tr>
  //             <th>Job Title</th>
  //             <th>Company</th>
  //             <th>Status</th>
  //             <th>Date</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {dummyProfile.interviews.map((interview, index) => (
  //             <tr key={index}>
  //               <td>{interview.jobTitle}</td>
  //               <td>{interview.company}</td>
  //               <td>{interview.status}</td>
  //               <td>{interview.date}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>

  //     <div>
  //       <h4>Suggestions</h4>
  //       <ul>
  //           {
  //               dummyProfile.suggestions.map((suggestion,index)=>(
  //                   <li key={index}>{suggestion}</li>
  //               ))
  //           }
  //       </ul>
  //     </div>


  //   </div>

  // )

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