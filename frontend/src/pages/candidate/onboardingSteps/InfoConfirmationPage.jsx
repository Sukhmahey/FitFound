// // import React from 'react'
// // import PersonalInfoStep from './PersonalInfoStep'
// // import WorkExperienceStep from './WorkExperienceStep'
// // import EducationSkillsStep from './EducationSkillsStep'

// // function InfoConfirmationPage({data}) {


// //     console.log(data);

// //   return (
// //     <div>
// //         <label>Name: </label>
// //         inp
// //     </div>
// //   )
// // }

// // export default InfoConfirmationPage

// import React, { useState } from 'react';
// import { candidateApi } from '../../../services/api';
// import { useAuth } from '../../../contexts/AuthContext';


// export default function InfoConfirmationPage({data}) {
//   const { user } = useAuth();
// const userId = user?.userId;

//    const [form, setForm] = useState(() => 
//     ({
//     personalInfo: {
//       firstName: data.personalInfo?.firstName || '',
//       middleName: data.personalInfo?.middleName || '',
//       lastName: data.personalInfo?.lastName || '',
//       email: data.personalInfo?.email || '',
//       currentStatus: data.personalInfo?.currentStatus || '',
//       specialization: data.personalInfo?.specialization || ''
//     },
//     basicInfo: {
//       phoneNumber: data.basicInfo?.phoneNumber || '',
//       workStatus: data.basicInfo?.workStatus || '',
//       language: data.basicInfo?.language || '',
//       bio: data.basicInfo?.bio || '',
//       additionalInfo: data.basicInfo?.additionalInfo || ''
//     },
//     skills: data.skills || [''],
//     workExperience: data.workExperience || [],
//     portfolio: {
//       socialLinks: {
//         linkedin: data.portfolio?.socialLinks?.linkedin || '',
//         personalPortfolioWebsite: data.portfolio?.socialLinks?.personalPortfolioWebsite || '',
//         additionalLinks: data.portfolio?.socialLinks?.additionalLinks || []
//       }
//     },
//     education: data.education || [],
//     jobPreference: {
//       desiredJobTitle: data.jobPreference?.desiredJobTitle || [],
//       jobType: data.jobPreference?.jobType || '',
//       salaryExpectation: {
//         min: data.jobPreference?.salaryExpectation?.min || 0,
//         perHour: data.jobPreference?.salaryExpectation?.perHour || false,
//         perYear: data.jobPreference?.salaryExpectation?.perYear || false
//       },
    
//   },}));


//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
    

//   };

// // const convertToBackendDate = (date) => {
// //   if (!date || !date.includes("-")) return date;
// //   const [year, month] = date.split("-");
// //   return `${month}-${year}`; 
// // };



//   const handleNestedChange = (section, field, value) => {
//     setForm({ ...form, [section]: { ...form[section], [field]: value } });
//   };

//   const handleArrayChange = (section, index, value) => {
//     const updated = [...form[section]];
//     updated[index] = value;
//     setForm({ ...form, [section]: updated });
//   };

//   const addToArray = (section) => {
//     setForm({ ...form, [section]: [...form[section], ''] });
//   };

//   const addWorkHistory = () => {
//     setForm({
//       ...form,
//       workHistory: [
//         ...form.workHistory,
//         { companyName: '', role: '', startDate: '', endDate: '', achievements: [''] },
//       ],
//     });
//   };

//   const updateWorkAchievement = (whIndex, achIndex, value) => {
//     const updated = [...form.workHistory];
//     updated[whIndex].achievements[achIndex] = value;
//     setForm({ ...form, workHistory: updated });
//   };

//   // const submitForm = ()=>{
//   //   console.log(form);
//   // }
//   const submitForm = async () => {
//   // const cleanedProfile = {
//   //   fullName: form.fullName,
//   //   email: form.email,
//   //   phone: form.phone,
//   //   preferredRole: form.preferredRole,
//   //   salary: Number(form.salaryExpectation),
//   //   bio: form.bio,
//   //   languages: form.languages,
//   //   specialization: form.specialization,
//   //   isEligibleToWork: form.eligibleToWork,
//   //   experienceLevel: 'junior',
//   //   jobType: 'full-time',
//   //   mainRole: form.preferredRole,
//   //   yearsOfExperience: 2
//   // };
//   const personalInfo = form.personalInfo;
// const basicInfo = form.basicInfo;
// const skills = form.skills.map(skill => ({ skill }));
// const workExperience = form.workExperience;
// const education = form.education;
// const portfolio = form.portfolio;
// const jobPreference = form.jobPreference;

//   // const skills = form.skills.map(skill => ({ skill }));

//   // const education = [
//   //   {
//   //     degree: form.education.degree,
//   //     field: form.education.fieldOfStudy,
//   //     gpa: form.education.gpa,
//   //     graduationDate: form.education.graduationDate,
//   //     institution: form.education.institution,
//   //   }
//   // ];

//   // const workHistory = form.workHistory.map(w => ({
//   //   company: w.companyName,
//   //   role: w.role,
//   //   startDate: w.startDate,
//   //   endDate: w.endDate,
//   //   current: false,
//   //   achievements: w.achievements,
//   // }));

//   try {
//     // await candidateApi.updateProfile(userId, cleanedProfile);
//     // await candidateApi.updateWorkHistory(userId, { workHistory });
//     // await candidateApi.updateEducation(userId, { education });
//     // await candidateApi.updateSkills(userId, { skills });
//     await candidateApi.updatePersonalInfo(userId, personalInfo);
// await candidateApi.updateBasicInfo(userId, basicInfo);
// await candidateApi.updateSkills(userId, { skills });
// await candidateApi.updateWorkHistory(userId, { workExperience });
// await candidateApi.updateEducation(userId, { education });
// await candidateApi.updatePortfolio(userId, portfolio);
// await candidateApi.updateJobPreference(userId, jobPreference);

//     alert("Confirmation data saved successfully!");
//   } catch (err) {
//     console.error("Failed to submit confirmation data:", err);
//     alert("Submission failed.");
//   }
// };


//   return (
//     <div>
//       <h2>Candidate Form</h2>

//       <label>Full Name:
//         <input value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} />
//       </label><br />

//       <label>Email:
//         <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
//       </label><br />

//       <label>Phone:
//         <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
//       </label><br />

//       <label>Preferred Role:
//         <input value={form.preferredRole} onChange={e => handleChange('preferredRole', e.target.value)} />
//       </label><br />

//       <label>Salary Expectation:
//         <input value={form.salaryExpectation} onChange={e => handleChange('salaryExpectation', e.target.value)} />
//       </label><br />

//       <label>Eligible to Work:
//         <input type="checkbox" checked={form.eligibleToWork} onChange={e => handleChange('eligibleToWork', e.target.checked)} />
//       </label><br />

//       <label>Specialization:
//         <input value={form.specialization} onChange={e => handleChange('specialization', e.target.value)} />
//       </label><br />

//       <label>Bio:
//         <textarea value={form.bio} onChange={e => handleChange('bio', e.target.value)} />
//       </label><br />

//       <label>Skills:</label><br />
//       {form.skills.map((skill, i) => (
//         <input key={i} value={skill} onChange={e => handleArrayChange('skills', i, e.target.value)} />
//       ))}
//       <button type="button" onClick={() => addToArray('skills')}>+ Add Skill</button><br />

//       <label>Languages:</label><br />
//       <select multiple onChange={e => {
//         const selected = Array.from(e.target.selectedOptions, opt => opt.value);
//         handleChange('languages', selected);
//       }}>
//         <option value="English">English</option>
//         <option value="French">French</option>
//         <option value="Hindi">Hindi</option>
//         <option value="Spanish">Spanish</option>
//       </select><br />

//       <fieldset>
//         <legend>Education</legend>
//         <label>Degree:
//           <input value={form.education.degree} onChange={e => handleNestedChange('education', 'degree', e.target.value)} />
//         </label><br />

//         <label>Field of Study:
//           <input value={form.education.fieldOfStudy} onChange={e => handleNestedChange('education', 'fieldOfStudy', e.target.value)} />
//         </label><br />

//         <label>GPA:
//           <input value={form.education.gpa} onChange={e => handleNestedChange('education', 'gpa', e.target.value)} />
//         </label><br />

//         <label>Graduation Date:
//           <input value={form.education.graduationDate} onChange={e => handleNestedChange('education', 'graduationDate', e.target.value)} />
//         </label><br />

//         <label>Institution:
//           <input value={form.education.institution} onChange={e => handleNestedChange('education', 'institution', e.target.value)} />
//         </label>
//       </fieldset>

//       <fieldset>
//         <legend>Work History</legend>
//         {form.workHistory.map((wh, i) => (
//           <div key={i} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
//             <label>Company Name:
//               <input value={wh.companyName} onChange={e => {
//                 const updated = [...form.workHistory];
//                 updated[i].companyName = e.target.value;
//                 handleChange('workHistory', updated);
//               }} />
//             </label><br />

//             <label>Role:
//               <input value={wh.role} onChange={e => {
//                 const updated = [...form.workHistory];
//                 updated[i].role = e.target.value;
//                 handleChange('workHistory', updated);
//               }} />
//             </label><br />

//             <label>Start Date:
//               <input value={wh.startDate} onChange={e => {
//                 const updated = [...form.workHistory];
//                 updated[i].startDate = e.target.value;
//                 handleChange('workHistory', updated);
//               }} />
//             </label><br />

//             <label>End Date:
//               <input value={wh.endDate} onChange={e => {
//                 const updated = [...form.workHistory];
//                 updated[i].endDate = e.target.value;
//                 handleChange('workHistory', updated);
//               }} />
//             </label><br />

//             <label>Achievements:</label><br />
//             {wh.achievements.map((ach, j) => (
//               <input key={j} value={ach} onChange={e => updateWorkAchievement(i, j, e.target.value)} />
//             ))}
//             <button type="button" onClick={() => {
//               const updated = [...form.workHistory];
//               updated[i].achievements.push('');
//               handleChange('workHistory', updated);
//             }}>+ Add Achievement</button>
//           </div>
//         ))}
//         <button type="button" onClick={addWorkHistory}>+ Add Work History</button>
//       </fieldset>

//       <fieldset>
//         <legend>Portfolio</legend>
//         <label>LinkedIn:
//           <input value={form.portfolio.linkedin} onChange={e => handleNestedChange('portfolio', 'linkedin', e.target.value)} />
//         </label><br />
//         <label>Website:
//           <input value={form.portfolio.website} onChange={e => handleNestedChange('portfolio', 'website', e.target.value)} />
//         </label><br />
//         <label>Additional Link:
//           <input value={form.portfolio.additional} onChange={e => handleNestedChange('portfolio', 'additional', e.target.value)} />
//         </label>
//       </fieldset>

//       <button onClick={submitForm}>Submit</button>

//     </div>
//   );
// }

import React, { useState } from 'react';
import { candidateApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function InfoConfirmationPage({ data }) {
  const { user } = useAuth();
  const userId = user?.userId;

  const [form, setForm] = useState(() => ({
    personalInfo: {
      firstName: data.personalInfo?.firstName || '',
      middleName: data.personalInfo?.middleName || '',
      lastName: data.personalInfo?.lastName || '',
      email: data.personalInfo?.email || '',
      currentStatus: data.personalInfo?.currentStatus || '',
      specialization: data.personalInfo?.specialization || ''
    },
    basicInfo: {
      phoneNumber: data.basicInfo?.phoneNumber || '',
      workStatus: data.basicInfo?.workStatus || '',
      language: data.basicInfo?.language || '',
      bio: data.basicInfo?.bio || '',
      additionalInfo: data.basicInfo?.additionalInfo || ''
    },
    skills: data.skills || [''],
    workExperience: data.workExperience || [],
    portfolio: {
      socialLinks: {
        linkedin: data.portfolio?.socialLinks?.linkedin || '',
        personalPortfolioWebsite: data.portfolio?.socialLinks?.personalPortfolioWebsite || '',
        additionalLinks: data.portfolio?.socialLinks?.additionalLinks || []
      }
    },
    education: data.education || [],
    jobPreference: {
      desiredJobTitle: data.jobPreference?.desiredJobTitle || [],
      jobType: data.jobPreference?.jobType || '',
      salaryExpectation: {
        min: data.jobPreference?.salaryExpectation?.min || 0,
        perHour: data.jobPreference?.salaryExpectation?.perHour || false,
        perYear: data.jobPreference?.salaryExpectation?.perYear || false
      }
    }
  }));

  const handleNestedChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleArrayChange = (section, index, value) => {
    const updated = [...form[section]];
    updated[index] = value;
    setForm(prev => ({ ...prev, [section]: updated }));
  };

  const addToArray = (section) => {
    setForm(prev => ({
      ...prev,
      [section]: [...prev[section], '']
    }));
  };

  const addWorkExperience = () => {
  setForm(prev => ({
    ...prev,
    workExperience: [
      ...prev.workExperience,
      {
        companyName: '',
        role: '',
        jobTitle: '',
        experienceLevel: '',
        remarkFromEmployer: '',
        startDate: '',
        endDate: '',
        achievements: ['']
      }
    ]
  }));
};


  const updateWorkAchievement = (weIndex, achIndex, value) => {
    const updated = [...form.workExperience];
    updated[weIndex].achievements[achIndex] = value;
    setForm(prev => ({ ...prev, workExperience: updated }));
  };
const formatDate = (date) => {
  if (!date) return '';
  const [year, month] = date.split('-');
  return `${month}-${year}`; 
};


  const submitForm = async () => {
    try {
      await candidateApi.updatePersonalInfo(userId, form.personalInfo);
      await candidateApi.updateBasicInfo(userId, form.basicInfo);
      await candidateApi.updateSkills(userId, {
        skills: form.skills.map(skill => ({ skill }))
      });
      await candidateApi.updateWorkHistory(userId, {
  workHistory: form.workExperience.map(exp => ({
    companyName: exp.companyName,
    jobTitle: exp.jobTitle,
    role: exp.role,
    startDate: formatDate(exp.startDate),
    endDate: formatDate(exp.endDate),
    achievements: exp.achievements,
    experienceLevel: exp.experienceLevel,
    remarkFromEmployer: exp.remarkFromEmployer
  }))
});



      await candidateApi.updateEducation(userId, {
        education: form.education
      });
      await candidateApi.updatePortfolio(userId, form.portfolio);
      await candidateApi.updateJobPreference(userId, form.jobPreference);

      alert("Confirmation data saved successfully!");
    } catch (err) {
      console.error("Failed to submit confirmation data:", err);
      alert("Submission failed.");
    }
  };

  return (
    <div>
      <h2>Candidate Form</h2>

      <label>First Name:
        <input value={form.personalInfo.firstName} onChange={e => handleNestedChange('personalInfo', 'firstName', e.target.value)} />
      </label><br />

      <label>Last Name:
        <input value={form.personalInfo.lastName} onChange={e => handleNestedChange('personalInfo', 'lastName', e.target.value)} />
      </label><br />

      <label>Email:
        <input type="email" value={form.personalInfo.email} onChange={e => handleNestedChange('personalInfo', 'email', e.target.value)} />
      </label><br />

      <label>Phone:
        <input value={form.basicInfo.phoneNumber} onChange={e => handleNestedChange('basicInfo', 'phoneNumber', e.target.value)} />
      </label><br />

      <label>Current Status:
        <select value={form.personalInfo.currentStatus} onChange={e => handleNestedChange('personalInfo', 'currentStatus', e.target.value)}>
          <option value="">Select status</option>
          <option value="Student">Student</option>
          <option value="Working Professional">Working Professional</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Other">Other</option>
        </select>
      </label><br />


      <label>Specialization:
        <input value={form.personalInfo.specialization} onChange={e => handleNestedChange('personalInfo', 'specialization', e.target.value)} />
      </label><br />

      <label>Bio:
        <textarea value={form.basicInfo.bio} onChange={e => handleNestedChange('basicInfo', 'bio', e.target.value)} />
      </label><br />

      <label>Skills:</label><br />
      {form.skills.map((skill, i) => (
        <input key={i} value={skill} onChange={e => handleArrayChange('skills', i, e.target.value)} />
      ))}
      <button type="button" onClick={() => addToArray('skills')}>+ Add Skill</button><br />

      <fieldset>
        <legend>Work Experience</legend>
        {form.workExperience.map((we, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <label>Company Name:
              <input value={we.companyName} onChange={e => {
                const updated = [...form.workExperience];
                updated[i].companyName = e.target.value;
                setForm({ ...form, workExperience: updated });
              }} />
            </label><br />
            <label>Role:
              <input value={we.role} onChange={e => {
                const updated = [...form.workExperience];
                updated[i].role = e.target.value;
                setForm({ ...form, workExperience: updated });
              }} />
            </label><br />
            <label>Job Title:
  <input value={we.jobTitle} onChange={e => {
    const updated = [...form.workExperience];
    updated[i].jobTitle = e.target.value;
    setForm({ ...form, workExperience: updated });
  }} />
</label><br />

<label>Experience Level:
  <select value={we.experienceLevel} onChange={e => {
    const updated = [...form.workExperience];
    updated[i].experienceLevel = e.target.value;
    setForm({ ...form, workExperience: updated });
  }}>
    <option value="">Select level</option>
    <option value="junior">Junior</option>
    <option value="middle">Middle</option>
    <option value="senior">Senior</option>
  </select>
</label><br />

<label>Remark from Employer:
  <textarea value={we.remarkFromEmployer} onChange={e => {
    const updated = [...form.workExperience];
    updated[i].remarkFromEmployer = e.target.value;
    setForm({ ...form, workExperience: updated });
  }} />
</label><br />

            <label>Start Date:
              <input type='month' value={we.startDate} onChange={e => {
                const updated = [...form.workExperience];
                updated[i].startDate = e.target.value;
                setForm({ ...form, workExperience: updated });
              }} />
            </label><br />
            <label>End Date:
              <input type='month' value={we.endDate} onChange={e => {
                const updated = [...form.workExperience];
                updated[i].endDate = e.target.value;
                setForm({ ...form, workExperience: updated });
              }} />
            </label><br />
            <label>Achievements:</label><br />
            {we.achievements.map((ach, j) => (
              <input key={j} value={ach} onChange={e => updateWorkAchievement(i, j, e.target.value)} />
            ))}
            <button type="button" onClick={() => {
              const updated = [...form.workExperience];
              updated[i].achievements.push('');
              setForm({ ...form, workExperience: updated });
            }}>+ Add Achievement</button>
          </div>
        ))}
        <button type="button" onClick={addWorkExperience}>+ Add Work Experience</button>
      </fieldset>

      <fieldset>
        <legend>Portfolio</legend>
        <label>LinkedIn:
          <input value={form.portfolio.socialLinks.linkedin} onChange={e => {
            const updated = { ...form.portfolio };
            updated.socialLinks.linkedin = e.target.value;
            setForm({ ...form, portfolio: updated });
          }} />
        </label><br />
        <label>Website:
          <input value={form.portfolio.socialLinks.personalPortfolioWebsite} onChange={e => {
            const updated = { ...form.portfolio };
            updated.socialLinks.personalPortfolioWebsite = e.target.value;
            setForm({ ...form, portfolio: updated });
          }} />
        </label><br />
        <label>Additional Link:
          <input value={form.portfolio.socialLinks.additionalLinks[0] || ''} onChange={e => {
            const updated = { ...form.portfolio };
            updated.socialLinks.additionalLinks[0] = e.target.value;
            setForm({ ...form, portfolio: updated });
          }} />
        </label>
      </fieldset>
      <label>Job Type:
  <select
    value={form.jobPreference.jobType}
    onChange={e => handleNestedChange('jobPreference', 'jobType', e.target.value)}
  >
    <option value="">Select job type</option>
    <option value="Remote">Remote</option>
    <option value="full-time">full-time</option>
    <option value="part-time">part-time</option>
    <option value="contract">contract</option>
    <option value="internship">internship</option>
    <option value="on-site">on-site</option>
    <option value="hybrid">hybrid</option>
  </select>
</label><br />


      <button onClick={submitForm}>Submit</button>
    </div>
  );
}