import process from 'process';
import React from 'react'
import { useState } from 'react';

const ResumeParserKey = process.env.ResumeParserKey

function ResumeParsing({setStep}) {

    const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

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
      const text = data.ParsedResults?.[0]?.ParsedText || 'No text found';

      const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i)?.[0] || 'Not found';
      const phone = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || 'Not found';

      const section = (key) => {
        const lines = text.split('\n');
        const start = lines.findIndex(line => new RegExp(`\\b${key}\\b`, 'i').test(line));
        if (start === -1) return 'Not found';
        const result = [];
        for (let i = start + 1; i < lines.length; i++) {
          if (/experience|education|skills|projects/i.test(lines[i])) break;
          result.push(lines[i].trim());
        }
        return result.join('\n') || 'Not found';
      };

      setOutput(
        `Email: ${email}\nPhone: ${phone}\n\nExperience:\n${section('experience')}\n\nEducation:\n${section('education')}\n\nSkills:\n${section('skills')}\n\nProjects:\n${section('projects')}`
      );
    } catch (err) {
      setOutput('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
};

  return (
    <div>
          <h2>Upload Resume</h2>
          <input type="file" id="fileInput" onChange={handleFileChange} />
          <button id="uploadBtn" disabled={loading}>{loading ? 'Extracting...' : 'Extract'}</button>
        <div id="result" style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>{output}</div>
        <button onClick={()=>{setStep(0)}}>Back to Home</button>
    </div>
  )
}

export default ResumeParsing