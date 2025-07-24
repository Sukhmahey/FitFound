import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCTGrxYxiZVDtbLMpBoE_S36Ca15pBF6vI"; // Your Gemini API key

// Initialize Gemini Model
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI
  ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  : null;


const formatSkills = (skills) => {
  if (!skills || skills.length === 0) return "N/A";
  return skills
    .map((s) => `${s.skill} (${s.level}, ${s.yearsOfExperience} years)`)
    .join("; ");
};


const formatWorkHistory = (history) => {
  if (!history || history.length === 0) return "N/A";
  return history
    .map((entry) => `${entry.role} at ${entry.companyName}`)
    .join("; ");
};


const formatEducation = (education) => {
  if (!education || education.length === 0) return "N/A";
  return education
    .map((edu) => `${edu.credentials} from ${edu.instituteName}`)
    .join("; ");
};


export const scoreCandidates = async (candidateArray, jobDescription) => {
  if (!model) {
    console.error("Gemini API model not initialized. Check API key.");
    return candidateArray.map((candidate) => ({
      ...candidate,
      matchingScore: null,
      reasoning: "Gemini API not initialized due to missing API key.",
    }));
  }

  if (!jobDescription || jobDescription.trim() === "") {
    console.error("Job description is empty.");
    return candidateArray.map((candidate) => ({
      ...candidate,
      matchingScore: null,
      reasoning: "Job description is empty.",
    }));
  }

  if (!candidateArray || candidateArray.length === 0) {
    console.warn("No candidates provided for scoring.");
    return [];
  }

  const scoredCandidates = [];

  for (const candidate of candidateArray) {

    const candidateName =
      candidate.personalInfo?.firstName && candidate.personalInfo?.lastName
        ? `${candidate.personalInfo.firstName} ${candidate.personalInfo.lastName}`
        : "N/A";
    const candidateBio = candidate.basicInfo?.bio || "N/A";
    const candidateMainRole = candidate.personalInfo?.specialization || "N/A"; // Using specialization as main role
    const candidatePreferredRoles =
      candidate.jobPreference?.desiredJobTitle || [];
    const candidateSkillsData = candidate.skills || [];
    const candidateWorkHistoryData = candidate.workHistory || [];
    const candidateEducationData = candidate.education || [];

    // Extracting other relevant fields for the prompt structure
    const candidateExperienceLevel =
      candidate.workHistory?.[0]?.experienceLevel || "N/A";
    // A more robust way to estimate years if needed, otherwise keep it simple
    let totalExperienceYears = 0;
    if (candidateWorkHistoryData.length > 0) {
      const sortedHistory = [...candidateWorkHistoryData].sort((a, b) => {
        const [aMonth, aYear] = a.startDate.split("-").map(Number);
        const [bMonth, bYear] = b.startDate.split("-").map(Number);
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
      const firstJobStartDate = sortedHistory[0].startDate;
      const [startMonth, startYear] = firstJobStartDate.split("-").map(Number);
      const startDate = new Date(startYear, startMonth - 1);
      const endDate = new Date(); // Current date
      totalExperienceYears = Math.floor(
        (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25)
      );
      if (totalExperienceYears < 0) totalExperienceYears = 0; // Handle future dates for now
    }
    const candidateExperienceYears = totalExperienceYears;

    const candidateJobTypePreference =
      candidate.jobPreference?.jobType || "N/A";
    const candidateAvailability = {
      // These fields are not explicitly in your JSON, leaving as N/A
      hours: "N/A",
      days: [],
    };
    const candidateWorkLocationPreference = []; // Not explicitly in your JSON
    const candidateSalaryExpectation =
      candidate.jobPreference?.salaryExpectation;
    // Heuristic based on "currentStatus" - assuming "Work" means open to work
    const candidateIsOpenToWork =
      candidate.basicInfo?.currentStatus === "Work" ||
      candidate.personalInfo?.currentStatus === "Work"
        ? "Yes"
        : "No";
    const candidateVisibilityCount = candidate.visibilityCount ?? "N/A"; // Not present in your JSON example
    const candidateVerifiedBadge = candidate.verifiedBadge ? "Yes" : "No"; // Not present in your JSON example
    const candidatePortfolioLinks =
      candidate.portfolio?.socialLinks?.additionalLinks || [];
    // --- End of Data extraction ---

    const prompt = `
You are an expert HR recruiter. Your task is to evaluate a candidate's suitability for a job.
For this evaluation, **strictly focus on matching skills and job titles/roles**.
Ignore specific experience levels, education dates, availability, and detailed achievements.
Provide a positive and constructive explanation for the score, highlighting strengths relevant to the job.

**Job Description:**
${jobDescription}

---

**Candidate Profile (Simplified Details):**
**Name:** ${candidateName}
**Bio/Summary:** ${candidateBio}
**Desired Job Titles:** ${candidatePreferredRoles.join(", ") || "N/A"}
**Specialization:** ${candidateMainRole}
**Skills:** ${formatSkills(candidateSkillsData)}
**Work History (Roles & Companies):**
- ${formatWorkHistory(candidateWorkHistoryData)}
**Education (Credentials & Institutes):** ${formatEducation(
      candidateEducationData
    )}

---

Based on the above simplified candidate profile and job description, provide a compatibility score as a percentage from 0 to 100, where 100% is a perfect match. Also, provide a brief, concise explanation (1-2 sentences) for the score, highlighting the main reasons for the match. If the match is not perfect, suggest areas for improvement *in the context of the job description*.

**Output Format:**
Score: [Your Score Here]
Reasoning: [Your Reasoning Here]
`;

    try {
      const result = await model.generateContent(prompt);
      const textOutput = result.response.text();

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

      scoredCandidates.push({
        ...candidate,
        score: score,
        reasoning: reasoning,
      });
    } catch (error) {
      console.error(
        `Error calling Gemini API for candidate ${candidateName || "unknown"}:`,
        error
      );
      scoredCandidates.push({
        ...candidate,
        matchingScore: null,
        reasoning: `Error processing candidate: ${error.message}`,
      });
    }
  }

  scoredCandidates.sort(
    (a, b) => (b.matchingScore || 0) - (a.matchingScore || 0)
  );

  return scoredCandidates;
};







// import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEY = "AIzaSyCTGrxYxiZVDtbLMpBoE_S36Ca15pBF6vI"; // Your Gemini API key

// // Initialize Gemini Model
// const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
// const model = genAI
//   ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
//   : null;

// // Helper to format skills (ORIGINAL DETAILED VERSION - unchanged)
// const formatSkills = (skills) => {
//   if (!skills || skills.length === 0) return "N/A";
//   return skills
//     .map((s) => `${s.skill} (${s.level}, ${s.yearsOfExperience} years)`)
//     .join("; ");
// };

// // Helper to format work history (ORIGINAL DETAILED VERSION - unchanged)
// const formatWorkHistory = (history) => {
//   if (!history || history.length === 0) return "N/A";
//   return history
//     .map((entry) => {
//       const achievements =
//         entry.achievements && entry.achievements.length > 0
//           ? `Achievements: ${entry.achievements.join(", ")}.`
//           : "";
//       const technologies =
//         entry.technologiesUsed && entry.technologiesUsed.length > 0
//           ? `Technologies: ${entry.technologiesUsed.join(", ")}.`
//           : "";
//       return `${entry.role} at ${entry.companyName} (${entry.startDate} - ${entry.endDate}). ${achievements} ${technologies}`.trim();
//     })
//     .join("\n- ");
// };

// // Helper to format education (ORIGINAL DETAILED VERSION - unchanged)
// const formatEducation = (education) => {
//   if (!education || education.length === 0) return "N/A";
//   return education
//     .map((edu) => `${edu.degree} from ${edu.institution} (${edu.year})`)
//     .join("; ");
// };

// // Main scoring function
// export const scoreCandidates = async (candidateArray, jobDescription) => {
//   if (!model) {
//     console.error("Gemini API model not initialized. Check API key.");
//     return candidateArray.map((candidate) => ({
//       ...candidate,
//       matchingScore: null,
//       reasoning: "Gemini API not initialized due to missing API key.",
//     }));
//   }

//   if (!jobDescription || jobDescription.trim() === "") {
//     console.error("Job description is empty.");
//     return candidateArray.map((candidate) => ({
//       ...candidate,
//       matchingScore: null,
//       reasoning: "Job description is empty.",
//     }));
//   }

//   if (!candidateArray || candidateArray.length === 0) {
//     console.warn("No candidates provided for scoring.");
//     return [];
//   }

//   const scoredCandidates = [];

//   for (const candidate of candidateArray) {
//     // --- START OF REQUIRED CHANGES: Corrected data extraction for the prompt ---
//     // These variables now correctly access data from your provided JSON structure
//     const candidateName = candidate.personalInfo?.firstName && candidate.personalInfo?.lastName
//       ? `${candidate.personalInfo.firstName} ${candidate.personalInfo.lastName}`
//       : "N/A";
//     const candidateBio = candidate.basicInfo?.bio || "N/A";
//     const candidateMainRole = candidate.personalInfo?.specialization || candidate.jobPreference?.desiredJobTitle?.[0] || "N/A";
//     const candidateExperienceLevel = candidate.workHistory?.[0]?.experienceLevel || "N/A"; // Taking from first work history entry
//     // A more robust way to estimate years of experience, handling potential future dates
//     let totalExperienceYears = 0;
//     if (candidate.workHistory?.length > 0) {
//       const sortedHistory = [...candidate.workHistory].sort((a, b) => {
//         const [aMonth, aYear] = a.startDate.split('-').map(Number);
//         const [bMonth, bYear] = b.startDate.split('-').map(Number);
//         return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
//       });
//       const firstJobStartDate = sortedHistory[0].startDate;
//       const [startMonth, startYear] = firstJobStartDate.split('-').map(Number);
//       const startDate = new Date(startYear, startMonth - 1);
//       const currentDate = new Date();
//       // Ensure we don't calculate negative years if start date is in future
//       if (startDate < currentDate) {
//         totalExperienceYears = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 365.25));
//       }
//     }
//     const candidateExperienceYears = totalExperienceYears;

//     const candidatePreferredRoles = candidate.jobPreference?.desiredJobTitle || [];
//     const candidateJobTypePreference = candidate.jobPreference?.jobType || "N/A";
//     const candidateAvailability = {
//       hours: "N/A", // Not explicitly in your JSON, keep as N/A
//       days: [], // Not explicitly in your JSON, keep as N/A
//     };
//     const candidateWorkLocationPreference = []; // Not explicitly in your JSON, keep as N/A
//     const candidateSalaryExpectation = candidate.jobPreference?.salaryExpectation;
//     // Heuristic for isOpenToWork based on 'currentStatus'
//     const candidateIsOpenToWork = (candidate.basicInfo?.currentStatus === "Work" || candidate.personalInfo?.currentStatus === "Work") ? "Yes" : "No";
//     const candidateVisibilityCount = candidate.visibilityCount ?? "N/A"; // Not directly present in your JSON example
//     const candidateVerifiedBadge = candidate.verifiedBadge ? "Yes" : "No"; // Not directly present in your JSON example
//     const candidatePortfolioLinks = candidate.portfolio?.socialLinks?.additionalLinks || [];

//     // Data for helper functions, directly from candidate object
//     const candidateSkills = candidate.skills;
//     const candidateWorkHistory = candidate.workHistory;
//     const candidateEducation = candidate.education;
//     // --- END OF REQUIRED CHANGES ---

//     const prompt = `
// You are an expert HR recruiter. Your task is to evaluate a candidate's suitability for a job based on the provided job description and their detailed profile.

// **Job Description:**
// ${jobDescription}

// ---

// **Candidate Profile (Full Details):**
// **Name:** ${candidateName}
// **Bio:** ${candidateBio}
// **Main Role:** ${candidateMainRole}
// **Experience Level:** ${candidateExperienceLevel} (${candidateExperienceYears || 0} years)
// **Preferred Roles:** ${candidatePreferredRoles.join(", ") || "N/A"}
// **Job Type Preference:** ${candidateJobTypePreference}
// **Availability:** ${
//       candidateAvailability.hours !== "N/A"
//         ? `${candidateAvailability.hours} on ${candidateAvailability.days.join(", ") || "N/A"}`
//         : "N/A"
//     }
// **Work Location Preference:** ${candidateWorkLocationPreference.join(", ") || "N/A"}
// **Salary Expectation:** ${
//       candidateSalaryExpectation &&
//       candidateSalaryExpectation.min !== undefined
//         ? `${candidateSalaryExpectation.min} ${
//             candidateSalaryExpectation.perHour
//               ? "per hour"
//               : candidateSalaryExpectation.perYear
//               ? "per year"
//               : ""
//           }`
//         : "N/A"
//     }
// **Skills:** ${formatSkills(candidateSkills)}
// **Work History:**
// - ${formatWorkHistory(candidateWorkHistory)}
// **Education:** ${formatEducation(candidateEducation)}
// **Is Open To Work:** ${candidateIsOpenToWork}
// **Visibility Count:** ${candidateVisibilityCount ?? "N/A"}
// **Verified Badge:** ${candidateVerifiedBadge}
// **Portfolio Links:** ${candidatePortfolioLinks.join(", ") || "N/A"}

// ---

// Based on the above candidate profile and job description, provide a comprehensive compatibility score as a percentage from 0 to 100, where 100% is a perfect match. Also, provide a brief, concise explanation (1-2 sentences) for the score, highlighting the main reasons for the match or mismatch.

// **Output Format:**
// Score: [Your Score Here]
// Reasoning: [Your Reasoning Here]
// `;

//     try {
//       const result = await model.generateContent(prompt);
//       const textOutput = result.response.text();

//       let score = null;
//       let reasoning = "Could not extract reasoning.";

//       const scoreMatch = textOutput.match(/Score:\s*(\d+)/i);
//       if (scoreMatch && scoreMatch[1]) {
//         score = parseInt(scoreMatch[1], 10);
//       }

//       const reasoningMatch = textOutput.match(/Reasoning:\s*(.*)/i);
//       if (reasoningMatch && reasoningMatch[1]) {
//         reasoning = reasoningMatch[1].trim();
//       }

//       scoredCandidates.push({
//         ...candidate,
//         score: score, // Remains 'score' as in your original
//         reasoning: reasoning,
//       });
//     } catch (error) {
//       console.error(
//         `Error calling Gemini API for candidate ${
//           candidateName || "unknown" // Use the correctly extracted name for error log
//         }:`,
//         error
//       );
//       scoredCandidates.push({
//         ...candidate,
//         matchingScore: null, // Remains 'matchingScore' here
//         reasoning: `Error processing candidate: ${error.message}`,
//       });
//     }
//   }

//   scoredCandidates.sort(
//     (a, b) => (b.matchingScore || 0) - (a.matchingScore || 0) // Remains 'matchingScore' here
//   );

//   return scoredCandidates;
// };