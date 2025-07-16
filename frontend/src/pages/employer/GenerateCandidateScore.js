import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCTGrxYxiZVDtbLMpBoE_S36Ca15pBF6vI"; // Your Gemini API key

// Initialize Gemini Model
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = genAI
  ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  : null;

// Helper to format skills
const formatSkills = (skills) => {
  if (!skills || skills.length === 0) return "N/A";
  return skills
    .map((s) => `${s.skill} (${s.level}, ${s.yearsOfExperience} years)`)
    .join("; ");
};

// Helper to format work history
const formatWorkHistory = (history) => {
  if (!history || history.length === 0) return "N/A";
  return history
    .map((entry) => {
      const achievements =
        entry.achievements && entry.achievements.length > 0
          ? `Achievements: ${entry.achievements.join(", ")}.`
          : "";
      const technologies =
        entry.technologiesUsed && entry.technologiesUsed.length > 0
          ? `Technologies: ${entry.technologiesUsed.join(", ")}.`
          : "";
      return `${entry.role} at ${entry.companyName} (${entry.startDate} - ${entry.endDate}). ${achievements} ${technologies}`.trim();
    })
    .join("\n- ");
};

// Helper to format education
const formatEducation = (education) => {
  if (!education || education.length === 0) return "N/A";
  return education
    .map((edu) => `${edu.degree} from ${edu.institution} (${edu.year})`)
    .join("; ");
};

// Main scoring function
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
    const prompt = `
You are an expert HR recruiter. Your task is to evaluate a candidate's suitability for a job based on the provided job description and their detailed profile.

**Job Description:**
${jobDescription}

---

**Candidate Profile (Full Details):**
**Name:** ${candidate.name || "N/A"}
**Bio:** ${candidate.bio || "N/A"}
**Main Role:** ${candidate.mainRole || "N/A"}
**Experience Level:** ${candidate.experienceLevel || "N/A"} (${
      candidate.experienceYears || 0
    } years)
**Preferred Roles:** ${
      (candidate.preferredRoles && candidate.preferredRoles.join(", ")) || "N/A"
    }
**Job Type Preference:** ${candidate.jobType || "N/A"}
**Availability:** ${
      candidate.availability
        ? `${candidate.availability.hours || "N/A"} on ${
            candidate.availability.days?.join(", ") || "N/A"
          }`
        : "N/A"
    }
**Work Location Preference:** ${
      (candidate.ableToWork || []).join(", ") || "N/A"
    }
**Salary Expectation:** ${
      candidate.salaryExpectation &&
      candidate.salaryExpectation.min !== undefined
        ? `${candidate.salaryExpectation.min} ${
            candidate.salaryExpectation.perHour
              ? "per hour"
              : candidate.salaryExpectation.perYear
              ? "per year"
              : ""
          }`
        : "N/A"
    }
**Skills:** ${formatSkills(candidate.skills)}
**Work History:**
- ${formatWorkHistory(candidate.workHistory)}
**Education:** ${formatEducation(candidate.education)}
**Is Open To Work:** ${
      candidate.isOpenToWork !== undefined
        ? candidate.isOpenToWork
          ? "Yes"
          : "No"
        : "N/A"
    }
**Visibility Count:** ${candidate.visibilityCount ?? "N/A"}
**Verified Badge:** ${candidate.verifiedBadge ? "Yes" : "No"}
**Portfolio Links:** ${
      candidate.portfolio?.socialLinks?.additionalLinks?.join(", ") || "N/A"
    }

---

Based on the above candidate profile and job description, provide a comprehensive compatibility score as a percentage from 0 to 100, where 100% is a perfect match. Also, provide a brief, concise explanation (1-2 sentences) for the score, highlighting the main reasons for the match or mismatch.

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
        matchingScore: score,
        reasoning: reasoning,
      });
    } catch (error) {
      console.error(
        `Error calling Gemini API for candidate ${
          candidate.name || "unknown"
        }:`,
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
