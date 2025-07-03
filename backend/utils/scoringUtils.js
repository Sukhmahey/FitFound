const roleTemplates = {
  "frontend developer": {
    requiredSkills: [
      "html",
      "css",
      "javascript",
      "react",
      "angular",
      "vue.js",
      "typescript",
      "git",
    ],
    relevantTitles: [
      "frontend developer",
      "web developer",
      "ui developer",
      "front-end engineer",
      "javascript developer",
    ],
    certificateKeywords: [
      "frontend",
      "web dev",
      "javascript",
      "react",
      "css",
      "html",
      "ui/ux",
    ],
    relevantDegrees: [
  "bca",
  "b.sc. it",
  "btech",
  "mtech",
  "m.sc. it",
  "p.d.d. web and mobile app development and design"
]
  },
  "backend developer": {
    requiredSkills: [
      "node.js",
      "express",
      "mongodb",
      "sql",
      "java",
      "python",
      "api",
      "rest",
      "graphql",
      "docker",
      "git",
    ],
    relevantTitles: [
      "backend developer",
      "api developer",
      "software engineer (backend)",
      "java developer",
      "python developer",
    ],
    relevantDegrees: [
  "bca",
  "b.sc. it",
  "btech",
  "mtech",
  "m.sc. it",
  "p.d.d. web and mobile app development and design"
],
    certificateKeywords: [
      "backend",
      "api",
      "node",
      "server",
      "database",
      "express",
      "cloud",
      "aws",
      "azure",
      "gcp",
    ],
  },
  "fullstack developer": {
    requiredSkills: [
      "html",
      "css",
      "javascript",
      "react",
      "node.js",
      "express",
      "mongodb",
      "git",
      "api",
    ],
    relevantTitles: [
      "fullstack developer",
      "software engineer (fullstack)",
      "web developer (fullstack)",
    ],
    relevantDegrees: [
  "bca",
  "b.sc. it",
  "btech",
  "mtech",
  "m.sc. it",
  "p.d.d. web and mobile app development and design"
],
    certificateKeywords: [
      "fullstack",
      "web dev",
      "javascript",
      "backend",
      "frontend",
      "api",
      "node",
      "react",
    ],
  },
  "ux designer": {
    requiredSkills: [
      "user research",
      "wireframing",
      "prototyping",
      "usability testing",
      "figma",
      "sketch",
      "adobe xd",
      "information architecture",
    ],
    relevantTitles: [
      "ux designer",
      "user experience designer",
      "ux specialist",
      "product designer (ux focus)",
      "human factors engineer",
    ],
    relevantDegrees: [
      "human-computer interaction",
      "h.c.i.",
      "cognitive psychology",
      "interaction design",
      "ux design",
    ],
    certificateKeywords: [
      "ux design",
      "user experience",
      "usability",
      "design thinking",
      "human centered design",
    ],
  },
  "ui designer": {
    requiredSkills: [
      "figma",
      "sketch",
      "adobe xd",
      "photoshop",
      "illustrator",
      "visual design",
      "design systems",
      "typography",
      "color theory",
    ],
    relevantTitles: [
      "ui designer",
      "user interface designer",
      "visual designer",
      "graphic designer (ui focus)",
      "product designer (ui focus)",
    ],
    relevantDegrees: [
      "graphic design",
      "visual communication",
      "fine arts",
      "web design",
    ],
    certificateKeywords: [
      "ui design",
      "user interface",
      "visual design",
      "design tools",
      "graphic design",
    ],
  },
};

// function calculateProfileScore(candidate, desiredRole) {
//   const normalizedDesiredRole = desiredRole?.toLowerCase();
//   const template = roleTemplates[normalizedDesiredRole];

//   if (!template) {
//     return 0;
//   }

//   let score = 0;

//   const WEIGHTS = {
//     SKILLS: 25,
//     CERTIFICATES: 10,
//     WORK_EXPERIENCE_TITLE: 20,
//     EDUCATION_FIELD: 15,
//     BIO_AND_PORTFOLIO: 10,
//     BASIC_INFO_COMPLETENESS: 20,
//   };

//   const candidateSkills =
//     candidate.skills?.map((s) => s.skill?.toLowerCase()) || [];
//   const skillMatches = candidateSkills.filter((skill) =>
//     template.requiredSkills.includes(skill)
//   );
//   if (template.requiredSkills.length > 0) {
//     score +=
//       (skillMatches.length / template.requiredSkills.length) * WEIGHTS.SKILLS;
//   }

//   const certs = candidate.certificates || [];
//   const matchedCerts = certs.filter((cert) =>
//     template.certificateKeywords.some((keyword) =>
//       cert.toLowerCase().includes(keyword)
//     )
//   );
//   if (certs.length === 0) {
//     score += 0;
//   } else if (matchedCerts.length > 0) {
//     score += Math.min(
//       (matchedCerts.length / template.certificateKeywords.length) *
//         WEIGHTS.CERTIFICATES,
//       WEIGHTS.CERTIFICATES
//     );
//   } else {
//     score += 1;
//   }

//   const hasMatchingJobTitle = candidate.workHistory?.some((job) =>
//     template.relevantTitles.includes(job.jobTitle?.toLowerCase())
//   );
//   score += hasMatchingJobTitle ? WEIGHTS.WORK_EXPERIENCE_TITLE : 0;

//   // const eduField = candidate.education?.[0]?.fieldOfStudy?.toLowerCase() || "";
//   // const eduMatch = template.relevantDegrees.includes(eduField);
//   // score += eduMatch ? WEIGHTS.EDUCATION_FIELD : 0;


// const credential = candidate.education?.[0]?.credentials?.toLowerCase() || "";
// const degreeMatch = template.relevantDegrees.some(degree =>
//   credential.includes(degree.toLowerCase())
// );
// score += degreeMatch ? WEIGHTS.EDUCATION_FIELD : 0;

//   const hasBio =
//     !!candidate.basicInfo?.bio && candidate.basicInfo.bio.length > 50;
//   const hasPortfolioWebsite =
//     !!candidate.portfolio?.socialLinks?.personalPortfolioWebsite;
//   const hasLinkedin = !!candidate.portfolio?.socialLinks?.linkedin;

//   if (hasBio && (hasPortfolioWebsite || hasLinkedin)) {
//     score += WEIGHTS.BIO_AND_PORTFOLIO;
//   } else if (hasBio || hasPortfolioWebsite || hasLinkedin) {
//     score += WEIGHTS.BIO_AND_PORTFOLIO / 2;
//   }

//   const hasPhoneNumber = !!candidate.basicInfo?.phoneNumber;
//   const hasLanguage = !!candidate.basicInfo?.language;
//   const hasEmail = !!candidate.personalInfo?.email;

//   if (hasPhoneNumber && hasLanguage && hasEmail) {
//     score += WEIGHTS.BASIC_INFO_COMPLETENESS;
//   } else if (hasPhoneNumber || hasLanguage || hasEmail) {
//     score += WEIGHTS.BASIC_INFO_COMPLETENESS / 2;
//   }

//   return Math.max(0, Math.min(100, Math.round(score)));
// }

// module.exports = {
//   roleTemplates,
//   calculateProfileScore,
// };



function calculateProfileScore(candidate, desiredRole) {
  const normalizedDesiredRole = desiredRole?.toLowerCase();
  const template = roleTemplates[normalizedDesiredRole];

  if (!template) {
    return 0;
  }

  let score = 0;

  const WEIGHTS = {
    SKILLS: 30, 
    WORK_EXPERIENCE_TITLE: 20,
    EDUCATION_FIELD: 15,
    BIO_AND_PORTFOLIO: 10,
    BASIC_INFO_COMPLETENESS: 25, 
  };

  const candidateSkills =
    candidate.skills?.map((s) => s.skill?.toLowerCase()) || [];
  const skillMatches = candidateSkills.filter((skill) =>
    template.requiredSkills.includes(skill)
  );
  if (template.requiredSkills.length > 0) {
    score +=
      (skillMatches.length / template.requiredSkills.length) * WEIGHTS.SKILLS;
  }

  const hasMatchingJobTitle = candidate.workHistory?.some((job) =>
    template.relevantTitles.includes(job.jobTitle?.toLowerCase())
  );
  score += hasMatchingJobTitle ? WEIGHTS.WORK_EXPERIENCE_TITLE : 0;

  const credential =
    candidate.education?.[0]?.credentials?.toLowerCase() || "";
  const degreeMatch = template.relevantDegrees.some((degree) =>
    credential.includes(degree.toLowerCase())
  );
  score += degreeMatch ? WEIGHTS.EDUCATION_FIELD : 0;

  const hasBio =
    !!candidate.basicInfo?.bio && candidate.basicInfo.bio.length > 50;
  const hasPortfolioWebsite =
    !!candidate.portfolio?.socialLinks?.personalPortfolioWebsite;
  const hasLinkedin = !!candidate.portfolio?.socialLinks?.linkedin;

  if (hasBio && (hasPortfolioWebsite || hasLinkedin)) {
    score += WEIGHTS.BIO_AND_PORTFOLIO;
  } else if (hasBio || hasPortfolioWebsite || hasLinkedin) {
    score += WEIGHTS.BIO_AND_PORTFOLIO / 2;
  }

  const hasPhoneNumber = !!candidate.basicInfo?.phoneNumber;
  const hasLanguage = !!candidate.basicInfo?.language;
  const hasEmail = !!candidate.personalInfo?.email;

  if (hasPhoneNumber && hasLanguage && hasEmail) {
    score += WEIGHTS.BASIC_INFO_COMPLETENESS;
  } else if (hasPhoneNumber || hasLanguage || hasEmail) {
    score += WEIGHTS.BASIC_INFO_COMPLETENESS / 2;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = {
  roleTemplates,
  calculateProfileScore,
};