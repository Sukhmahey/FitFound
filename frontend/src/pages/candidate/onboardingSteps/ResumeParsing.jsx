import React from 'react'

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