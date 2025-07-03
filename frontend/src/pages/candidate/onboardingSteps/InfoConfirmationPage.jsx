
import React, { useState } from 'react';
import { candidateApi } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Container, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox, Stack, Divider, Chip, RadioGroup, Radio } from '@mui/material';


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
    education: (data.education || []).map(edu => {
      const toHtmlMonth = (dateStr) => {
        if (!dateStr) return '';
        const [mm, yyyy] = dateStr.split('-');
        return `${yyyy}-${mm.padStart(2, '0')}`;  // returns YYYY-MM
      };

      return {
        instituteName: edu.instituteName || edu.institution || '',
        credentials: edu.credentials || edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        startDate: toHtmlMonth(edu.startDate || edu.graduationDate || ''),
        endDate: toHtmlMonth(edu.endDate || edu.graduationDate || '')
      };

    })


    ,
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
    console.log("Submitting data", {
      personalInfo: form.personalInfo,
      basicInfo: form.basicInfo,
      skills: form.skills.map(skill => ({ skill })),
      workHistory: form.workExperience.map(exp => ({
        companyName: exp.companyName,
        jobTitle: exp.jobTitle,
        role: exp.role,
        startDate: formatDate(exp.startDate),
        endDate: formatDate(exp.endDate),
        achievements: exp.achievements,
        experienceLevel: exp.experienceLevel,
        remarkFromEmployer: exp.remarkFromEmployer
      })),
      education: form.education.map(edu => ({
        instituteName: edu.instituteName,
        credentials: edu.credentials,
        startDate: formatDate(edu.startDate),
        endDate: formatDate(edu.endDate)
      })),
      portfolio: form.portfolio,
      jobPreference: form.jobPreference
    });

    try {
      await candidateApi.updatePersonalInfo(userId, form.personalInfo);
      await candidateApi.updateBasicInfo(userId, form.basicInfo);
      // await candidateApi.updateSkills(userId, {
      //   skills: form.skills.map(skill => ({ skill }))
      // });
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
        education: form.education.map(edu => ({
          instituteName: edu.instituteName,
          credentials: edu.credentials,
          startDate: formatDate(edu.startDate),
          endDate: formatDate(edu.endDate)
        }))

      });

      await candidateApi.updatePortfolio(userId, form.portfolio);
      await candidateApi.updateJobPreference(userId, form.jobPreference);

      alert("Confirmation data saved successfully!");
      navigate('/candidate/dashboard');
    } catch (err) {
      console.error("Failed to submit confirmation data:", err);
      alert("Submission failed.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <h2>Candidate Info Confirmation</h2>

        <Box display="flex" flexDirection="column" gap={3} >

          {/* Personal Info */}
          <Divider textAlign="left">Personal Info</Divider>
          <Box display="flex" flexDirection="column" gap={2} border="1px solid #ccc" borderRadius={2} p={2} mb={2}>
            <Box fullWidth display="flex" flexDirection="row" gap={2}>
              <TextField fullWidth label="First Name" value={form.personalInfo.firstName} onChange={e => handleNestedChange('personalInfo', 'firstName', e.target.value)} />
              <TextField fullWidth label="Middle Name" value={form.personalInfo.middleName} onChange={e => handleNestedChange('personalInfo', 'middleName', e.target.value)} />
              <TextField fullWidth label="Last Name" value={form.personalInfo.lastName} onChange={e => handleNestedChange('personalInfo', 'lastName', e.target.value)} />
            </Box>
            <TextField type="email" label="Email" value={form.personalInfo.email} onChange={e => handleNestedChange('personalInfo', 'email', e.target.value)} />
            <FormControl fullWidth>
              <InputLabel>Current Status</InputLabel>
              <Select value={form.personalInfo.currentStatus} onChange={e => handleNestedChange('personalInfo', 'currentStatus', e.target.value)}>
                <MenuItem value="">Select status</MenuItem>
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Working Professional">Working Professional</MenuItem>
                <MenuItem value="Unemployed">Unemployed</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Specialization" value={form.personalInfo.specialization} onChange={e => handleNestedChange('personalInfo', 'specialization', e.target.value)} />
          </Box>
          <Divider textAlign="left">Basic Info</Divider>

          {/* Basic Info */}
          <Box display="flex" flexDirection="column" gap={3} border="1px solid #ccc" borderRadius={2} p={2} mb={2}>


            <TextField label="Phone Number" value={form.basicInfo.phoneNumber} onChange={e => handleNestedChange('basicInfo', 'phoneNumber', e.target.value)} />
            <TextField label="Work Status" value={form.basicInfo.workStatus} onChange={e => handleNestedChange('basicInfo', 'workStatus', e.target.value)} />
            <TextField label="Language" value={form.basicInfo.language} onChange={e => handleNestedChange('basicInfo', 'language', e.target.value)} />
            <TextField label="Bio" multiline rows={3} value={form.basicInfo.bio} onChange={e => handleNestedChange('basicInfo', 'bio', e.target.value)} />
            <TextField label="Additional Info" multiline rows={3} value={form.basicInfo.additionalInfo} onChange={e => handleNestedChange('basicInfo', 'additionalInfo', e.target.value)} />
          </Box>

          {/* Skills */}
          <Divider textAlign="left">Skills</Divider>

          <Box display="flex" flexDirection="column" gap={3} border="1px solid #ccc" borderRadius={2} p={2} mb={2}>


            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Add Skill"
                value={form.newSkill || ''}
                onChange={e => setForm(prev => ({ ...prev, newSkill: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const trimmed = form.newSkill?.trim();
                    if (trimmed) {
                      setForm(prev => ({
                        ...prev,
                        skills: [...prev.skills, trimmed],
                        newSkill: ''
                      }));
                    }
                  }
                }}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {form.skills.map((skill, i) => (
                  <Chip
                    key={i}
                    label={skill}
                    onDelete={() => {
                      const updated = form.skills.filter((_, index) => index !== i);
                      setForm(prev => ({ ...prev, skills: updated }));
                    }}
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>

          </Box>

          {/* Education */}
          <Divider textAlign="left">Education</Divider>

          <Box display="flex" flexDirection="column" gap={3}>

            {form.education.map((edu, i) => (
              <Box key={i} border="1px solid #ccc" borderRadius={2} p={2} mb={2} >
                <Box display="flex" flexDirection="column" gap={3}>
                  <TextField fullWidth label="Institute Name" value={edu.instituteName} onChange={e => {
                    const updated = [...form.education];
                    updated[i].instituteName = e.target.value;
                    setForm({ ...form, education: updated });
                  }} />
                  <TextField fullWidth label="Credentials" value={edu.credentials} onChange={e => {
                    const updated = [...form.education];
                    updated[i].credentials = e.target.value;
                    setForm({ ...form, education: updated });
                  }} />
                  <TextField type="month" fullWidth label="Start Date" InputLabelProps={{ shrink: true }} value={edu.startDate} onChange={e => {
                    const updated = [...form.education];
                    updated[i].startDate = e.target.value;
                    setForm({ ...form, education: updated });
                  }} />
                  <TextField type="month" fullWidth label="End Date" InputLabelProps={{ shrink: true }} value={edu.endDate} onChange={e => {
                    const updated = [...form.education];
                    updated[i].endDate = e.target.value;
                    setForm({ ...form, education: updated });
                  }} />
                </Box>
              </Box>
            ))}
            <Button onClick={() => setForm(prev => ({
              ...prev,
              education: [...prev.education, {
                instituteName: '',
                credentials: '',
                startDate: '',
                endDate: ''
              }]
            }))}>+ Add Education</Button>
          </Box>

          {/* Work Experience */}
          <Divider textAlign="left">Work Experience</Divider>

          <Box display="flex" flexDirection="column" gap={3}>

            {form.workExperience.map((we, i) => (
              <Box key={i} border="1px solid #ccc" borderRadius={2} p={2} mb={2}>
                <Box display="flex" flexDirection="column" gap={3}>


                  <TextField fullWidth label="Company Name" value={we.companyName} onChange={e => {
                    const updated = [...form.workExperience];
                    updated[i].companyName = e.target.value;
                    setForm({ ...form, workExperience: updated });
                  }} />
                  <TextField fullWidth label="Role" value={we.role} onChange={e => {
                    const updated = [...form.workExperience];
                    updated[i].role = e.target.value;
                    setForm({ ...form, workExperience: updated });
                  }} />
                  <TextField fullWidth label="Job Title" value={we.jobTitle} onChange={e => {
                    const updated = [...form.workExperience];
                    updated[i].jobTitle = e.target.value;
                    setForm({ ...form, workExperience: updated });
                  }} />
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel>Experience Level</InputLabel>
                    <Select value={we.experienceLevel} label="Experience Level" onChange={e => {
                      const updated = [...form.workExperience];
                      updated[i].experienceLevel = e.target.value;
                      setForm({ ...form, workExperience: updated });
                    }}>
                      <MenuItem value="">Select level</MenuItem>
                      <MenuItem value="junior">Junior</MenuItem>
                      <MenuItem value="middle">Middle</MenuItem>
                      <MenuItem value="senior">Senior</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField fullWidth label="Remark From Employer" multiline rows={2} value={we.remarkFromEmployer} onChange={e => {
                    const updated = [...form.workExperience];
                    updated[i].remarkFromEmployer = e.target.value;
                    setForm({ ...form, workExperience: updated });
                  }} />
                  <TextField type="month" fullWidth label="Start Date" InputLabelProps={{ shrink: true }} value={we.startDate} onChange={e => {
                    const updated = [...form.workExperience];
                    updated[i].startDate = e.target.value;
                    setForm({ ...form, workExperience: updated });
                  }} />
                  <TextField type="month" fullWidth label="End Date" InputLabelProps={{ shrink: true }} value={we.endDate} onChange={e => {
                    const updated = [...form.workExperience];
                    updated[i].endDate = e.target.value;
                    setForm({ ...form, workExperience: updated });
                  }} />
                  {we.achievements.map((ach, j) => (
                    <TextField
                      key={j}
                      label={`Achievement ${j + 1}`}
                      fullWidth
                      value={ach}
                      onChange={e => updateWorkAchievement(i, j, e.target.value)}
                    />
                  ))}
                  <Button onClick={() => {
                    const updated = [...form.workExperience];
                    updated[i].achievements.push('');
                    setForm({ ...form, workExperience: updated });
                  }} sx={{ mt: 1 }}>+ Add Achievement</Button>
                </Box>
              </Box>
            ))}
            <Button onClick={addWorkExperience}>+ Add Work Experience</Button>
          </Box>

          {/* Portfolio */}
          <Divider textAlign="left">Portfolio</Divider>

          <Box display="flex" flexDirection="column" gap={3} border="1px solid #ccc" borderRadius={2} p={2} mb={2}>
            <TextField label="LinkedIn" fullWidth value={form.portfolio.socialLinks.linkedin} onChange={e => {
              const updated = { ...form.portfolio };
              updated.socialLinks.linkedin = e.target.value;
              setForm({ ...form, portfolio: updated });
            }} />
            <TextField label="Website" fullWidth value={form.portfolio.socialLinks.personalPortfolioWebsite} onChange={e => {
              const updated = { ...form.portfolio };
              updated.socialLinks.personalPortfolioWebsite = e.target.value;
              setForm({ ...form, portfolio: updated });
            }} />
            <TextField label="Additional Link" fullWidth value={form.portfolio.socialLinks.additionalLinks[0] || ''} onChange={e => {
              const updated = { ...form.portfolio };
              updated.socialLinks.additionalLinks[0] = e.target.value;
              setForm({ ...form, portfolio: updated });
            }} />
          </Box>

          {/* Job Preference */}
          <Divider textAlign="left">Job Preference</Divider>
          <Box border="1px solid #ccc" borderRadius={2} p={2} mb={2}>

            <Box display="flex" flexDirection="column" gap={3} border="1px solid #ccc" borderRadius={2} p={2} mb={2}>

              {/* <h6>Desired Job Titles</h6>
              {form.jobPreference.desiredJobTitle.map((title, i) => (
                <TextField
                  key={i}
                  fullWidth
                  label={`Title ${i + 1}`}
                  value={title}
                  onChange={e => {
                    const updated = [...form.jobPreference.desiredJobTitle];
                    updated[i] = e.target.value;
                    setForm(prev => ({
                      ...prev,
                      jobPreference: {
                        ...prev.jobPreference,
                        desiredJobTitle: updated
                      }
                    }));
                  }}
                />
              ))}
              <Button variant='outlined' onClick={() => setForm(prev => ({
                ...prev,
                jobPreference: {
                  ...prev.jobPreference,
                  desiredJobTitle: [...prev.jobPreference.desiredJobTitle, '']
                }
              }))}>+ Add Desired Job Title</Button> */}
              <FormControl fullWidth>
                <InputLabel>Desired Role</InputLabel>
                <Select
                  value={form.jobPreference.desiredJobTitle?.[0] || ''}
                  onChange={(e) =>
                    setForm(prev => ({
                      ...prev,
                      jobPreference: {
                        ...prev.jobPreference,
                        desiredJobTitle: [e.target.value]
                      }
                    }))
                  }
                >
                  <MenuItem value="">Select job role</MenuItem>
                  {["frontend developer", "backend developer", "fullstack developer", "ux designer", "ui designer"].map(role => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" flexDirection="column" gap={3}>

              <h4>Salary Expectation</h4>
              <TextField
                label="Minimum Salary"
                type="number"
                fullWidth
                value={form.jobPreference.salaryExpectation.min}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    jobPreference: {
                      ...prev.jobPreference,
                      salaryExpectation: {
                        ...prev.jobPreference.salaryExpectation,
                        min: parseInt(e.target.value || 0)
                      }
                    }
                  }))
                }
              />

              <FormControl component="fieldset">
                <InputLabel shrink>Salary Basis</InputLabel>
                <RadioGroup
                  value={
                    form.jobPreference.salaryExpectation.perHour
                      ? 'perHour'
                      : form.jobPreference.salaryExpectation.perYear
                        ? 'perYear'
                        : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      jobPreference: {
                        ...prev.jobPreference,
                        salaryExpectation: {
                          ...prev.jobPreference.salaryExpectation,
                          perHour: value === 'perHour',
                          perYear: value === 'perYear'
                        }
                      }
                    }));
                  }}
                >
                  <FormControlLabel value="perHour" control={<Radio />} label="Per Hour" />
                  <FormControlLabel value="perYear" control={<Radio />} label="Per Year" />
                </RadioGroup>
              </FormControl>



              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={form.jobPreference.jobType}
                  label="Job Type"
                  onChange={e => handleNestedChange('jobPreference', 'jobType', e.target.value)}
                >
                  <MenuItem value="">Select job type</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                  <MenuItem value="on-site">On-site</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box mt={4}>
            <Button variant="contained" color="primary" onClick={submitForm}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );


}