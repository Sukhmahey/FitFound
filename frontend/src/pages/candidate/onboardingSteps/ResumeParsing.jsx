import React from 'react'
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


// import { useState } from 'react';


// const ResumeParserKey = process.env.REACT_APP_ResumeParserKey;

// console.log("ResumeParserKey:", ResumeParserKey); 

// function ResumeParsing({ setStep, setConfirmedData }) {
//   const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [finalData , setFinalData] = useState({});
//   // const [confirmedData, setConfirmedData] = useState({});


//   const extractSkills = (text) => {
//   const start = text.toLowerCase().indexOf('skills');
//   if (start === -1) return [];

//   const rest = text.slice(start + 6).split('\n');
//   const skillsLines = rest.slice(0, 5); 
//   const rawSkills = skillsLines.join(',').split(/[,•\-]/);

//   const stopWords = ['experience', 'company', 'role', 'duration', 'education', 'summary'];

//   return rawSkills
//     .map(skill => skill.trim())
//     .filter(skill =>
//       skill &&
//       !stopWords.some(word => skill.toLowerCase().includes(word))
//     );
// };



  
//   const extractExperience = (text) => {
//     const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
//     const jobs = [];
//     let currentJob = null;

//     for (const line of lines) {
//       if (line.toLowerCase().startsWith('company:')) {
//         if (currentJob) jobs.push(currentJob);
//         currentJob = {
//           companyName: line.split('Company:')[1]?.trim() || '',
//           role: '',
//           startDate: null,
//           endDate: null,
//           achievements: [],
//           technologiesUsed: []
//         };
//       } else if (line.toLowerCase().startsWith('role:')) {
//         if (currentJob) currentJob.role = line.split('Role:')[1]?.trim() || '';
//       } else if (line.toLowerCase().startsWith('duration:')) {
//         const parts = line.split('Duration:')[1]?.split('to') || [];
//         if (currentJob) {
//           currentJob.startDate = parts[0]?.trim() || null;
//           currentJob.endDate = parts[1]?.trim() || null;
//         }
//       } else if (currentJob && line.startsWith('-')) {
//         currentJob.achievements.push(line.slice(1).trim());
//       }
//     }

//     if (currentJob) jobs.push(currentJob);
//     return jobs;
//   };

  

// const extractEducation = (text) => {
//   const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
//   const educationEntries = [];

//   let startIndex = -1;
//   for (let i = 0; i < lines.length; i++) {
//     if (lines[i].toLowerCase().startsWith('education')) {
//       startIndex = i;
//       break;
//     }
//   }

//   if (startIndex === -1 || lines.length < startIndex + 2) {
//     return [];
//   }

//   const entryLines = lines.slice(startIndex + 1, startIndex + 4);

//   educationEntries.push({
//     institution: entryLines[0] || '',
//     degree: entryLines[1] || '',
//     graduationDate: entryLines.find(line => line.toLowerCase().includes('year')) || null,
//     gpa: null,
//     fieldOfStudy: entryLines[1]?.includes('(')
//       ? entryLines[1].split('(')[1].replace(')', '')
//       : null
//   });

//   return educationEntries;
// };

//  const confirmNow = () => {
//     setConfirmedData(finalData);  
//     setStep(99);           
//   };



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
//       const res = await fetch('https://api.ocr.space/parse/image', {
//         method: 'POST',
//         headers: { apikey: ResumeParserKey },
//         body: formData
//       });

//       const data = await res.json();
//       console.log("FULL OCR RESPONSE:", data);
      

//       if (data.IsErroredOnProcessing) {
//         throw new Error(data.ErrorMessage || 'OCR failed');
//       }

//       const text = data.ParsedResults?.[0]?.ParsedText || '';
//       console.log("RAW OCR TEXT:\n", text);


//       const structuredData = {
//         skills: extractSkills(text),
//         workHistory: extractExperience(text),
//         education: extractEducation(text),
//         mainRole: '',
//         experienceLevel: '',
//         experienceYears: null,
//         preferredRoles: [],
//         isOpenToWork: true,
//         jobType: null,
//         salaryExpectation: null,
//         visibilityCount: null,
//         verifiedBadge: false,
//         ableToWork: []
//       };

//       setOutput(JSON.stringify(structuredData, null, 2));
//       setFinalData(structuredData);
//     } catch (err) {
//       setOutput(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Resume</h2>
//       <input type="file" onChange={handleFileChange} />
//       <button disabled={loading}>
//         {loading ? 'Extracting…' : 'Extract'}
//       </button>

//       <pre>{output}</pre>
//       <button onClick={confirmNow}>CONFIRM</button>
//       <button onClick={() => setStep(0)}>Back to Home</button>
//     </div>
//   );
// }

// export default ResumeParsing;


// import { useState } from 'react';

// const ResumeParserKey = process.env.REACT_APP_ResumeParserKey;

// function ResumeParsing({ setStep, setConfirmedData }) {
//   const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [finalData, setFinalData] = useState({});

//   const extractEmail = (text) => {
//     const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
//     return match ? match[0] : null;
//   };
//     const extractPhone = (text) => {
//     const match = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
//     return match ? match[0] : null;
//   };
// const extractLinks = (text) => {
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   const matches = text.match(urlRegex);
//   if (!matches) return [];
//   return matches.map(url => url.trim());
// };
// const extractLanguages = (text) => {
//   const langMatch = text.match(/languages?[:\-\s]*([\s\S]+?)(experience|education|projects|summary)/i);
//   if (!langMatch) return [];
//   return langMatch[1]
//     .split(/[\n,•\-]+/)
//     .map(s => s.trim())
//     .filter(s => s && !/\d/.test(s));
// };

// const extractBioSummary = (text) => {
//   const bioMatch = text.match(/summary[:\-\s]*([\s\S]+?)(experience|education|skills|projects)/i);
//   if (!bioMatch) return '';
//   return bioMatch[1].trim();
// };


//   const extractName = (text) => {
//     const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
//     const nameLine = lines[0];
//     const likelyName = /^[A-Z][a-z]+\s[A-Z][a-z]+/.test(nameLine) ? nameLine : '';
//     return likelyName;
//   };

//   const extractSkills = (text) => {
//     const skillsMatch = text.match(/skills[:\-\s]*([\s\S]+?)(experience|education|projects|summary)/i);
//     if (!skillsMatch) return [];
//     return skillsMatch[1]
//       .split(/[\n,•\-]+/)
//       .map(s => s.trim())
//       .filter(s => s && !/\d/.test(s));
//   };

//   const extractExperience = (text) => {
//   const jobs = [];
//   const jobBlocks = text.split(/(?=Company:)/g);

//   for (const block of jobBlocks) {
//     const companyMatch = block.match(/Company:\s*(.*)/i);
//     const roleMatch = block.match(/Role:\s*(.*)/i);
//     const durationMatch = block.match(/Duration:\s*(.*)/i);
//     const achievements = [...block.matchAll(/-\s*(.+)/g)]
//   .map(m => m[1].trim())
//   .filter(line =>
//     !/^\d{4}/.test(line) &&                    
//     !/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i.test(line) && // skip lines with months
//     !/to\s+\d{4}/i.test(line)                  
//   );

//     if (companyMatch) {
//       jobs.push({
//         companyName: companyMatch[1]?.trim() || '',
//         role: roleMatch?.[1]?.trim() || '',
//         startDate: durationMatch?.[1]?.split('to')[0]?.trim() || null,
//         endDate: durationMatch?.[1]?.split('to')[1]?.trim() || null,
//         achievements,
//         technologiesUsed: [] // You can optionally add tech parsing here
//       });
//     }
//   }

//   return jobs;
// };


// const extractEducation = (text) => {
//   const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
//   const eduIndex = lines.findIndex(line => /education/i.test(line));
//   if (eduIndex === -1 || lines.length <= eduIndex + 1) return [];

//   const eduLines = lines.slice(eduIndex + 1, eduIndex + 6); // Look ahead max 5 lines
//   let institution = '', degree = '', graduation = '';

//   for (let line of eduLines) {
//     if (!institution && /^[A-Z].+University/i.test(line)) institution = line;
//     else if (!degree && /(Bachelor|Master|BCA|BSc|MSc|BA|MA)/i.test(line)) degree = line;
//     else if (!graduation && /(20\d{2}|Graduation Year)/i.test(line)) graduation = line;
//   }

//   return [{
//     institution,
//     degree,
//     graduationDate: graduation || null,
//     gpa: null,
//     fieldOfStudy: degree.includes('(') ? degree.split('(')[1].replace(')', '') : null
//   }];
// };


//   const confirmNow = () => {
//     setConfirmedData(finalData);
//     setStep(99);
//   };

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
//       const res = await fetch('https://api.ocr.space/parse/image', {
//         method: 'POST',
//         headers: { apikey: ResumeParserKey },
//         body: formData
//       });

//       const data = await res.json();
//       if (data.IsErroredOnProcessing) throw new Error(data.ErrorMessage || 'OCR failed');

//       const text = data.ParsedResults?.[0]?.ParsedText || '';
//       console.log("OCR TEXT:\n", text);

//       const structuredData = {
//                 personalInfo: {
//           firstName: extractName(text).split(' ')[0] || '',
//           middleName: '',
//           lastName: extractName(text).split(' ')[1] || '',
//           email: extractEmail(text) || '',
//           currentStatus: '',
//           specialization: ''
//         },
//         basicInfo: {
//           phoneNumber: extractPhone(text),
//           workStatus: '',
//           language: '',
//           bio: extractBioSummary(text),
//           additionalInfo: ''
//         },
//         skills: extractSkills(text),
//         workExperience: extractExperience(text),
//         portfolio: {
//           socialLinks: {
//             linkedin: '',
//             personalPortfolioWebsite: '',
//             additionalLinks: extractLinks(text).filter(link => !link.includes('@'))
//           }
//         },
//         education: extractEducation(text),
//         jobPreference: {
//           desiredJobTitle: [],
//           jobType: '',
//           salaryExpectation: {
//             min: 0,
//             perHour: false,
//             perYear: false
//           }
//         }
//       };

//       setOutput(JSON.stringify(structuredData, null, 2));
//       setFinalData(structuredData);
//     } catch (err) {
//       setOutput(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Resume</h2>
//       <input type="file" onChange={handleFileChange} />
//       <button disabled={loading}>{loading ? 'Extracting…' : 'Extract'}</button>
//       <pre>{output}</pre>
//       <button onClick={confirmNow}>CONFIRM</button>
//       <button onClick={() => setStep(0)}>Back to Home</button>
//     </div>
//   );
// }

// export default ResumeParsing;


import { useState } from 'react';

const ResumeParserKey = process.env.REACT_APP_ResumeParserKey;

function ResumeParsing({ setStep, setConfirmedData }) {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [finalData, setFinalData] = useState({});

  const extractEmail = (text) => text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || '';
  const extractPhone = (text) => text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || '';

  const extractName = (text) => {
    const line = text.split('\n').map(l => l.trim()).filter(Boolean)[0];
    return /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) ? line : '';
  };

  const extractSkills = (text) => {
    const match = text.match(/skills[:\-\s]*([\s\S]+?)(experience|education|projects|summary)/i);
    return match ? match[1].split(/[\n,•\-]+/).map(s => s.trim()).filter(s => s && !/\d/.test(s)) : [];
  };

  const extractExperience = (text) => {
    const jobs = text.split(/(?=Company:)/g).map(block => {
      const company = block.match(/Company:\s*(.*)/i)?.[1]?.trim() || '';
      const role = block.match(/Role:\s*(.*)/i)?.[1]?.trim() || '';
      const [startDate, endDate] = block.match(/Duration:\s*(.*)/i)?.[1]?.split('to').map(d => d.trim()) || [];
      const achievements = [...block.matchAll(/-\s*(.+)/g)].map(m => m[1].trim()).filter(line =>
        !/^\d{4}/.test(line) && !/January|February|...|December/i.test(line)
      );
      return company ? { companyName: company, role, startDate, endDate, achievements, technologiesUsed: [] } : null;
    }).filter(Boolean);
    return jobs;
  };

  const extractEducation = (text) => {
    const lines = text.split('\n').map(l => l.trim());
    const start = lines.findIndex(l => /education/i.test(l));
    if (start === -1) return [];

    const info = lines.slice(start + 1, start + 6);
    let institution = '', degree = '', graduationDate = '';

    for (let line of info) {
      if (!institution && /University/i.test(line)) institution = line;
      else if (!degree && /(Bachelor|Master|BSc|BCA|MCA)/i.test(line)) degree = line;
      else if (!graduationDate && /20\d{2}/.test(line)) graduationDate = line;
    }

    return [{
      institution,
      degree,
      graduationDate,
      gpa: null,
      fieldOfStudy: degree.includes('(') ? degree.split('(')[1].replace(')', '') : null
    }];
  };

  const extractBioSummary = (text) => {
    return text.match(/summary[:\-\s]*([\s\S]+?)(experience|education|skills|projects)/i)?.[1]?.trim() || '';
  };

  const extractLanguages = (text) => {
    const match = text.match(/languages?[:\-\s]*([\s\S]+?)(experience|education|projects|summary)/i);
    return match ? match[1].split(/[\n,•\-]+/).map(s => s.trim()).filter(s => s) : [];
  };

  const extractLinks = (text) => {
    const urls = text.match(/https?:\/\/[^\s]+/g) || [];
    return {
      linkedin: urls.find(link => link.includes('linkedin')) || '',
      personalPortfolioWebsite: urls.find(link => link.includes('portfolio')) || '',
      additionalLinks: urls.filter(link => !link.includes('linkedin') && !link.includes('portfolio'))
    };
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
      const text = data.ParsedResults?.[0]?.ParsedText || '';

      const nameParts = extractName(text).split(' ');

      const structuredData = {
        personalInfo: {
          firstName: nameParts[0] || '',
          middleName: '',
          lastName: nameParts[1] || '',
          email: extractEmail(text),
          currentStatus: '',
          specialization: ''
        },
        basicInfo: {
          phoneNumber: extractPhone(text),
          workStatus: '',
          language: extractLanguages(text).join(', '),
          bio: extractBioSummary(text),
          additionalInfo: ''
        },
        skills: extractSkills(text),
        workExperience: extractExperience(text),
        education: extractEducation(text),
        portfolio: { socialLinks: extractLinks(text) },
        jobPreference: {
          desiredJobTitle: [],
          jobType: '',
          salaryExpectation: { min: 0, perHour: false, perYear: false }
        }
      };

      setOutput(JSON.stringify(structuredData, null, 2));
      setFinalData(structuredData);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmNow = () => {
    setConfirmedData(finalData);
    setStep(99);
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <input type="file" onChange={handleFileChange} />
      <button disabled={loading}>{loading ? 'Extracting…' : 'Extract'}</button>
      <pre>{output}</pre>
      <button onClick={confirmNow}>CONFIRM</button>
      <button onClick={() => setStep(0)}>Back to Home</button>
    </div>
  );
}

export default ResumeParsing;