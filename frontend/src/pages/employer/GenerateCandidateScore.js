import React, { useState } from "react";

const GenerateCandidateScore = ({ candidateArray, jd }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [candidates, setCandidates] = useState(
    candidateArray || [
      {
        name: "Alice Smith",
        bio: "Experienced software engineer with a strong background in web development and cloud technologies.",
        workHistory:
          "5 years at TechCo as a Senior Backend Developer (Python, Django, AWS). 3 years at StartupX as a Full-stack Developer (JavaScript, React, Node.js).",
        skills: [
          "Python",
          "Django",
          "AWS",
          "JavaScript",
          "React",
          "Node.js",
          "SQL",
          "REST APIs",
          "Docker",
          "Kubernetes",
        ],
        jobPreference:
          "Senior Backend or Full-stack role, remote or Vancouver, BC, interested in FinTech or AI.",
        specialization: "Scalable backend systems, cloud architecture.",
      },
      {
        name: "Bob Johnson",
        bio: "Marketing professional with expertise in digital campaigns and social media management.",
        workHistory:
          "7 years at MarketingPro as a Digital Marketing Manager. Managed campaigns, SEO, SEM, and content creation.",
        skills: [
          "Digital Marketing",
          "SEO",
          "SEM",
          "Content Marketing",
          "Social Media Management",
          "Google Analytics",
          "CRM",
        ],
        jobPreference:
          "Marketing leadership role, Toronto, ON, interested in consumer goods.",
        specialization: "Performance marketing, brand strategy.",
      },
      // Add more candidate objects as needed, or load them from a file/API
    ]
  );

  const [scoredCandidates, setScoredCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "AIzaSyBOiyPPc5IQ5cQrIrtEF71TDpfUnh4dPOI";

  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
  const model = genAI
    ? genAI.getGenerativeModel({ model: "gemini-pro" })
    : null;

  const getCandidateScore = async (jd, candidate) => {
    if (!model) {
      throw new Error("Gemini API model not initialized. Check API key.");
    }

    const prompt = `
        You are an expert HR recruiter. Your task is to evaluate a candidate's suitability for a job based on the provided job description and their profile.
    
        **Job Description:**
        ${jd}
    
        ---
    
        **Candidate Profile:**
        **Name:** ${candidate.name || "N/A"}
        **Bio:** ${candidate.bio || "N/A"}
        **Work History:** ${candidate.workHistory || "N/A"}
        **Skills:** ${
          (candidate.skills && Array.isArray(candidate.skills)
            ? candidate.skills.join(", ")
            : candidate.skills) || "N/A"
        }
        **Job Preference:** ${candidate.jobPreference || "N/A"}
        **Specialization:** ${candidate.specialization || "N/A"}
    
        ---
    
        Based on the above, provide a comprehensive compatibility score for the candidate against this job description on a scale of 0 to 100, where 100 is a perfect match. Also, provide a brief, concise explanation (1-2 sentences) for the score, highlighting the main reasons for the match or mismatch.
    
        **Output Format:**
        Score: [Your Score Here]
        Reasoning: [Your Reasoning Here]
        `;

    try {
      const result = await model.generateContent(prompt);
      const textOutput = result.response.text();

      // Basic parsing of Gemini's response
      let score = null;
      let reasoning = "Could not extract reasoning.";

      const scoreMatch = textOutput.match(/Score:\s*(\d+)/i);
      if (scoreMatch && scoreMatch[1]) {
        score = parseInt(scoreMatch[1], 10);
      }

      const reasoningMatch = textOutput.match(/Reasoning:\s*(.*)/i);
      if (reasoningMatch && reasoningMatch[1]) {
        reasoning = reasoningMatch[1].trim();
      }

      return { score, reasoning };
    } catch (error) {
      console.error(
        `Error calling Gemini API for candidate ${
          candidate.name || "unknown"
        }:`,
        error
      );
      throw new Error(`Failed to get score from AI: ${error.message}`);
    }
  };
};

export default generateCandidateScore;
