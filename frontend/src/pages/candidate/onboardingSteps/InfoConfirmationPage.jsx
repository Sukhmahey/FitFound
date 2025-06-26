
import React, { useState } from 'react';
import { candidateApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function InfoConfirmationPage({ data }) {
  const { user } = useAuth();
  const userId = user?.userId;
  const navigate = useNavigate();

  const convertToHtmlMonth = (date) => {
  if (!date || !/^\d{2}-\d{4}$/.test(date)) return '';
  const [month, year] = date.split('-');
  return `${year}-${month.padStart(2, '0')}`; // YYYY-MM
};


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
    // workExperience: data.workExperience || [],
    workExperience: (data.workExperience || []).map(exp => ({
  ...exp,
  startDate: convertToHtmlMonth(exp.startDate),
  endDate: convertToHtmlMonth(exp.endDate)
}))
,
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
      navigate('/dashboard');
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