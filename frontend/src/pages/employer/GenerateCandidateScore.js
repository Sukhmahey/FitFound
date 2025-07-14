const OPENROUTER_API_KEY =
  "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";
const SITE_URL = "http://localhost:3000"; // Change to your actual site domain
const APP_NAME = "FitFound";

const formatSkills = (skills) => {
  if (!skills || skills.length === 0) return "N/A";
  return skills
    .map((s) => `${s.skill} (${s.level}, ${s.yearsOfExperience} years)`)
    .join("; ");
};

const formatWorkHistory = (history) => {
  if (!history || history.length === 0) return "N/A";
  return history
    .map((entry) => {
      const achievements =
        entry.achievements?.length > 0
          ? `Achievements: ${entry.achievements.join(", ")}.`
          : "";
      const technologies =
        entry.technologiesUsed?.length > 0
          ? `Technologies: ${entry.technologiesUsed.join(", ")}.`
          : "";
      return `${entry.role} at ${entry.companyName} (${entry.startDate} - ${entry.endDate}). ${achievements} ${technologies}`.trim();
    })
    .join("\n- ");
};

const formatEducation = (education) => {
  if (!education || education.length === 0) return "N/A";
  return education
    .map((edu) => `${edu.degree} from ${edu.institution} (${edu.year})`)
    .join("; ");
};

const buildPrompt = (candidate, jobDescription) => `
You are an expert HR recruiter. Evaluate the candidate based on the job description and give a compatibility score (0-100) and a short reasoning.

**Job Description:**
${jobDescription}

**Candidate Profile:**
Name: ${candidate.name || "N/A"}
Bio: ${candidate.bio || "N/A"}
Main Role: ${candidate.mainRole || "N/A"}
Experience Level: ${candidate.experienceLevel || "N/A"} (${
  candidate.experienceYears || 0
} years)
Preferred Roles: ${(candidate.preferredRoles || []).join(", ") || "N/A"}
Job Type Preference: ${candidate.jobType || "N/A"}
Availability: ${candidate.availability?.hours || "N/A"} on ${
  (candidate.availability?.days || []).join(", ") || "N/A"
}
Work Location Preference: ${(candidate.ableToWork || []).join(", ") || "N/A"}
Salary Expectation: ${
  candidate.salaryExpectation?.min
    ? `${candidate.salaryExpectation.min} ${
        candidate.salaryExpectation.perHour
          ? "per hour"
          : candidate.salaryExpectation.perYear
          ? "per year"
          : ""
      }`
    : "N/A"
}
Skills: ${formatSkills(candidate.skills)}
Work History:
- ${formatWorkHistory(candidate.workHistory)}
Education: ${formatEducation(candidate.education)}
Open To Work: ${candidate.isOpenToWork ? "Yes" : "No"}
Visibility Count: ${candidate.visibilityCount || "N/A"}
Verified Badge: ${candidate.verifiedBadge ? "Yes" : "No"}
Portfolio Links: ${
  candidate.portfolio?.socialLinks?.additionalLinks?.join(", ") || "N/A"
}

Respond in the following format:
Score: [0-100]
Reasoning: [Short explanation]
`;

const callOpenRouter = async (prompt, model) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": SITE_URL,
        "X-Title": APP_NAME,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw { status: response.status, ...errorData };
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

export const scoreCandidates = async (candidateArray, jobDescription) => {
  if (!OPENROUTER_API_KEY) {
    console.error("Missing API key.");
    return candidateArray.map((c) => ({
      ...c,
      matchingScore: null,
      reasoning: "Missing OpenRouter API key.",
    }));
  }

  if (!jobDescription) {
    return candidateArray.map((c) => ({
      ...c,
      matchingScore: null,
      reasoning: "Job description is missing.",
    }));
  }

  const scoredCandidates = [];
  const primaryModel = "meta-llama/llama-4-maverick:free";
  const fallbackModel = "mistralai/mistral-7b-instruct";

  for (const candidate of candidateArray) {
    const prompt = buildPrompt(candidate, jobDescription);

    try {
      let responseText;

      try {
        responseText = await callOpenRouter(prompt, primaryModel);
      } catch (error) {
        if (error.status === 503) {
          console.warn("Primary model unavailable. Using fallback...");
          responseText = await callOpenRouter(prompt, fallbackModel);
        } else {
          throw error;
        }
      }

      const scoreMatch = responseText.match(/Score:\s*(\d+)/i);
      const reasoningMatch = responseText.match(/Reasoning:\s*(.*)/i);

      scoredCandidates.push({
        ...candidate,
        matchingScore: scoreMatch ? parseInt(scoreMatch[1]) : null,
        reasoning: reasoningMatch
          ? reasoningMatch[1].trim()
          : "No reasoning found.",
      });
    } catch (err) {
      console.error("Error scoring candidate:", candidate.name, err);
      scoredCandidates.push({
        ...candidate,
        matchingScore: null,
        reasoning: "Error occurred: " + (err.message || "Unknown error"),
      });
    }
  }

  return scoredCandidates.sort(
    (a, b) => (b.matchingScore || 0) - (a.matchingScore || 0)
  );
};
