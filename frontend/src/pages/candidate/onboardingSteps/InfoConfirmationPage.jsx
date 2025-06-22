// import React from 'react'
// import PersonalInfoStep from './PersonalInfoStep'
// import WorkExperienceStep from './WorkExperienceStep'
// import EducationSkillsStep from './EducationSkillsStep'

// function InfoConfirmationPage({data}) {


//     console.log(data);

//   return (
//     <div>
//         <label>Name: </label>
//         inp
//     </div>
//   )
// }

// export default InfoConfirmationPage

import React, { useState } from 'react';
import { candidateApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';


export default function InfoConfirmationPage({data}) {
  const { user } = useAuth();
const userId = user?.userId;

   const [form, setForm] = useState(() => ({
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    skills: data.skills || [''],
    preferredRole: data.mainRole || '',
    salaryExpectation: data.salaryExpectation || '',
    eligibleToWork: data.ableToWork?.length > 0,
    bio: '',
    languages: [],
    specialization: data.specialization || '',
    education: data.education?.[0] || {
      degree: '',
      fieldOfStudy: '',
      gpa: '',
      graduationDate: '',
      institution: '',
    },
    workHistory: data.workHistory?.length > 0 ? data.workHistory : [
      {
        companyName: '',
        role: '',
        startDate: '',
        endDate: '',
        achievements: [''],
      }
    ],
    portfolio: {
      linkedin: '',
      website: '',
      additional: '',
    }
  }));


  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    

  };

// const convertToBackendDate = (date) => {
//   if (!date || !date.includes("-")) return date;
//   const [year, month] = date.split("-");
//   return `${month}-${year}`; 
// };



  const handleNestedChange = (section, field, value) => {
    setForm({ ...form, [section]: { ...form[section], [field]: value } });
  };

  const handleArrayChange = (section, index, value) => {
    const updated = [...form[section]];
    updated[index] = value;
    setForm({ ...form, [section]: updated });
  };

  const addToArray = (section) => {
    setForm({ ...form, [section]: [...form[section], ''] });
  };

  const addWorkHistory = () => {
    setForm({
      ...form,
      workHistory: [
        ...form.workHistory,
        { companyName: '', role: '', startDate: '', endDate: '', achievements: [''] },
      ],
    });
  };

  const updateWorkAchievement = (whIndex, achIndex, value) => {
    const updated = [...form.workHistory];
    updated[whIndex].achievements[achIndex] = value;
    setForm({ ...form, workHistory: updated });
  };

  // const submitForm = ()=>{
  //   console.log(form);
  // }
  const submitForm = async () => {
  const cleanedProfile = {
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    preferredRole: form.preferredRole,
    salary: Number(form.salaryExpectation),
    bio: form.bio,
    languages: form.languages,
    specialization: form.specialization,
    isEligibleToWork: form.eligibleToWork,
    experienceLevel: 'junior',
    jobType: 'full-time',
    mainRole: form.preferredRole,
    yearsOfExperience: 2
  };

  const skills = form.skills.map(skill => ({ skill }));

  const education = [
    {
      degree: form.education.degree,
      field: form.education.fieldOfStudy,
      gpa: form.education.gpa,
      graduationDate: form.education.graduationDate,
      institution: form.education.institution,
    }
  ];

  const workHistory = form.workHistory.map(w => ({
    company: w.companyName,
    role: w.role,
    startDate: w.startDate,
    endDate: w.endDate,
    current: false,
    achievements: w.achievements,
  }));

  try {
    await candidateApi.updateProfile(userId, cleanedProfile);
    await candidateApi.updateWorkHistory(userId, { workHistory });
    await candidateApi.updateEducation(userId, { education });
    await candidateApi.updateSkills(userId, { skills });

    alert("Confirmation data saved successfully!");
  } catch (err) {
    console.error("Failed to submit confirmation data:", err);
    alert("Submission failed.");
  }
};


  return (
    <div>
      <h2>Candidate Form</h2>

      <label>Full Name:
        <input value={form.fullName} onChange={e => handleChange('fullName', e.target.value)} />
      </label><br />

      <label>Email:
        <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
      </label><br />

      <label>Phone:
        <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
      </label><br />

      <label>Preferred Role:
        <input value={form.preferredRole} onChange={e => handleChange('preferredRole', e.target.value)} />
      </label><br />

      <label>Salary Expectation:
        <input value={form.salaryExpectation} onChange={e => handleChange('salaryExpectation', e.target.value)} />
      </label><br />

      <label>Eligible to Work:
        <input type="checkbox" checked={form.eligibleToWork} onChange={e => handleChange('eligibleToWork', e.target.checked)} />
      </label><br />

      <label>Specialization:
        <input value={form.specialization} onChange={e => handleChange('specialization', e.target.value)} />
      </label><br />

      <label>Bio:
        <textarea value={form.bio} onChange={e => handleChange('bio', e.target.value)} />
      </label><br />

      <label>Skills:</label><br />
      {form.skills.map((skill, i) => (
        <input key={i} value={skill} onChange={e => handleArrayChange('skills', i, e.target.value)} />
      ))}
      <button type="button" onClick={() => addToArray('skills')}>+ Add Skill</button><br />

      <label>Languages:</label><br />
      <select multiple onChange={e => {
        const selected = Array.from(e.target.selectedOptions, opt => opt.value);
        handleChange('languages', selected);
      }}>
        <option value="English">English</option>
        <option value="French">French</option>
        <option value="Hindi">Hindi</option>
        <option value="Spanish">Spanish</option>
      </select><br />

      <fieldset>
        <legend>Education</legend>
        <label>Degree:
          <input value={form.education.degree} onChange={e => handleNestedChange('education', 'degree', e.target.value)} />
        </label><br />

        <label>Field of Study:
          <input value={form.education.fieldOfStudy} onChange={e => handleNestedChange('education', 'fieldOfStudy', e.target.value)} />
        </label><br />

        <label>GPA:
          <input value={form.education.gpa} onChange={e => handleNestedChange('education', 'gpa', e.target.value)} />
        </label><br />

        <label>Graduation Date:
          <input value={form.education.graduationDate} onChange={e => handleNestedChange('education', 'graduationDate', e.target.value)} />
        </label><br />

        <label>Institution:
          <input value={form.education.institution} onChange={e => handleNestedChange('education', 'institution', e.target.value)} />
        </label>
      </fieldset>

      <fieldset>
        <legend>Work History</legend>
        {form.workHistory.map((wh, i) => (
          <div key={i} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <label>Company Name:
              <input value={wh.companyName} onChange={e => {
                const updated = [...form.workHistory];
                updated[i].companyName = e.target.value;
                handleChange('workHistory', updated);
              }} />
            </label><br />

            <label>Role:
              <input value={wh.role} onChange={e => {
                const updated = [...form.workHistory];
                updated[i].role = e.target.value;
                handleChange('workHistory', updated);
              }} />
            </label><br />

            <label>Start Date:
              <input value={wh.startDate} onChange={e => {
                const updated = [...form.workHistory];
                updated[i].startDate = e.target.value;
                handleChange('workHistory', updated);
              }} />
            </label><br />

            <label>End Date:
              <input value={wh.endDate} onChange={e => {
                const updated = [...form.workHistory];
                updated[i].endDate = e.target.value;
                handleChange('workHistory', updated);
              }} />
            </label><br />

            <label>Achievements:</label><br />
            {wh.achievements.map((ach, j) => (
              <input key={j} value={ach} onChange={e => updateWorkAchievement(i, j, e.target.value)} />
            ))}
            <button type="button" onClick={() => {
              const updated = [...form.workHistory];
              updated[i].achievements.push('');
              handleChange('workHistory', updated);
            }}>+ Add Achievement</button>
          </div>
        ))}
        <button type="button" onClick={addWorkHistory}>+ Add Work History</button>
      </fieldset>

      <fieldset>
        <legend>Portfolio</legend>
        <label>LinkedIn:
          <input value={form.portfolio.linkedin} onChange={e => handleNestedChange('portfolio', 'linkedin', e.target.value)} />
        </label><br />
        <label>Website:
          <input value={form.portfolio.website} onChange={e => handleNestedChange('portfolio', 'website', e.target.value)} />
        </label><br />
        <label>Additional Link:
          <input value={form.portfolio.additional} onChange={e => handleNestedChange('portfolio', 'additional', e.target.value)} />
        </label>
      </fieldset>

      <button onClick={submitForm}>Submit</button>

    </div>
  );
}