// import React from 'react'
// import { useState } from 'react';

// const ResumeParserKey = process.env.REACT_APP_ResumeParserKey;

// function ResumeParsing({setStep}) {

//     const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);
//     setOutput('');

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('language', 'eng');
//     formData.append('isOverlayRequired', 'false');

//     try {
//       console.log("AppKey",ResumeParserKey)
//       const res = await fetch('https://api.ocr.space/parse/image', {
//         method: 'POST',
//         headers: { apikey: ResumeParserKey },
//         body: formData
//       });

//       const data = await res.json();
//       const text = data.ParsedResults?.[0]?.ParsedText || 'No text found';

//       const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i)?.[0] || 'Not found';
//       const phone = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || 'Not found';

//       const section = (key) => {
//         const lines = text.split('\n');
//         const start = lines.findIndex(line => new RegExp(`\\b${key}\\b`, 'i').test(line));
//         if (start === -1) return 'Not found';
//         const result = [];
//         for (let i = start + 1; i < lines.length; i++) {
//           if (/experience|education|skills|projects/i.test(lines[i])) break;
//           result.push(lines[i].trim());
//         }
//         return result.join('\n') || 'Not found';
//       };

//       setOutput(
//         `Email: ${email}\nPhone: ${phone}\n\nExperience:\n${section('experience')}\n\nEducation:\n${section('education')}\n\nSkills:\n${section('skills')}\n\nProjects:\n${section('projects')}`
//       );
//     } catch (err) {
//       setOutput('Error: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
// };

//   return (
//     <div>
//           <h2>Upload Resume</h2>
//           <input type="file" id="fileInput" onChange={handleFileChange} />
//           <button id="uploadBtn" disabled={loading}>{loading ? 'Extracting...' : 'Extract'}</button>
//         <div id="result" style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>{output}</div>
//         <button onClick={()=>{setStep(0)}}>Back to Home</button>
//     </div>
//   )
// }

// export default ResumeParsing


import { useState } from 'react';

const ResumeParserKey = process.env.REACT_APP_ResumeParserKey;

function ResumeParsing({ setStep }) {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const extractSkills = (text) => {
  const start = text.toLowerCase().indexOf('skills');
  if (start === -1) return [];

  const rest = text.slice(start + 6).split('\n');
  const skillsLines = rest.slice(0, 5); 
  const rawSkills = skillsLines.join(',').split(/[,•\-]/);

  const stopWords = ['experience', 'company', 'role', 'duration', 'education', 'summary'];

  return rawSkills
    .map(skill => skill.trim())
    .filter(skill =>
      skill &&
      !stopWords.some(word => skill.toLowerCase().includes(word))
    );
};



  
  const extractExperience = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const jobs = [];
    let currentJob = null;

    for (const line of lines) {
      if (line.toLowerCase().startsWith('company:')) {
        if (currentJob) jobs.push(currentJob);
        currentJob = {
          companyName: line.split('Company:')[1]?.trim() || '',
          role: '',
          startDate: null,
          endDate: null,
          achievements: [],
          technologiesUsed: []
        };
      } else if (line.toLowerCase().startsWith('role:')) {
        if (currentJob) currentJob.role = line.split('Role:')[1]?.trim() || '';
      } else if (line.toLowerCase().startsWith('duration:')) {
        const parts = line.split('Duration:')[1]?.split('to') || [];
        if (currentJob) {
          currentJob.startDate = parts[0]?.trim() || null;
          currentJob.endDate = parts[1]?.trim() || null;
        }
      } else if (currentJob && line.startsWith('-')) {
        currentJob.achievements.push(line.slice(1).trim());
      }
    }

    if (currentJob) jobs.push(currentJob);
    return jobs;
  };

  
  const extractEducation = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const educationEntries = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    const isEducationLine =
      line.includes('university') ||
      line.includes('college') ||
      line.includes('bca') ||
      line.includes('b.sc') ||
      line.includes('bachelor') ||
      line.includes('mca') ||
      line.includes('m.sc');

    if (isEducationLine) {
      
      const entryLines = lines.slice(i, i + 3);
      educationEntries.push({
        institution: entryLines[0] || '',
        degree: entryLines[1] || null,
        fieldOfStudy: entryLines[2] || null,
        graduationDate: null,
        gpa: null
      });
      i += 2; 
    }
  }

  return educationEntries;
};



  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setOutput('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');

    try {
      const res = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: { apikey: ResumeParserKey },
        body: formData
      });

      const data = await res.json();
      

      if (data.IsErroredOnProcessing) {
        throw new Error(data.ErrorMessage || 'OCR failed');
      }

      const text = data.ParsedResults?.[0]?.ParsedText || '';
      console.log("RAW OCR TEXT:\n", text);


      const structuredData = {
        skills: extractSkills(text),
        workHistory: extractExperience(text),
        education: extractEducation(text),
        mainRole: '',
        experienceLevel: '',
        experienceYears: null,
        preferredRoles: [],
        isOpenToWork: true,
        jobType: null,
        salaryExpectation: null,
        visibilityCount: null,
        verifiedBadge: false,
        ableToWork: []
      };

      setOutput(JSON.stringify(structuredData, null, 2));
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <input type="file" onChange={handleFileChange} />
      <button disabled={loading}>
        {loading ? 'Extracting…' : 'Extract'}
      </button>

      <pre>{output}</pre>

      <button onClick={() => setStep(0)}>Back to Home</button>
    </div>
  );
}

export default ResumeParsing;