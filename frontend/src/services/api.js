import axios from "axios";

// Dummy mode: when true, the app uses mock data instead of real backend calls.
// Enable by setting REACT_APP_DUMMY_MODE=true in frontend/.env
const USE_MOCK =
  process.env.REACT_APP_DUMMY_MODE === "true" ||
  !process.env.REACT_APP_API_URL;

const api = !USE_MOCK
  ? axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  : null;

const mockDelay = (data, ms = 200) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

// ---------- Mock data ----------

const mockCandidateProfile = {
  personalInfo: {
    firstName: "Alex",
    lastName: "Johnson",
  },
  basicInfo: {
    phoneNumber: "+1 555-123-4567",
    location: "Toronto, Canada",
  },
  skills: ["React", "Node.js", "MongoDB", "TypeScript"],
  workHistory: [
    {
      companyName: "Demo Tech Inc.",
      role: "Frontend Developer",
      startDate: "2021-01-01",
      endDate: "2023-06-30",
      experienceLevel: "Mid",
      description: "Built modern React frontends for SaaS products.",
    },
  ],
  education: [
    {
      instituteName: "Demo University",
      credentials: "BSc Computer Science",
      startDate: "2017-09-01",
      endDate: "2021-06-30",
    },
  ],
  jobPreference: {
    desiredJobTitle: ["Frontend Developer"],
    jobType: "full-time",
    salaryExpectation: {
      min: 40,
      max: 70,
    },
  },
  profileScore: 82,
};

const mockInteractions = [
  {
    _id: "interaction-1",
    candidateId: "guest-profile-1",
    employerId: {
      companyName: "Acme Corp",
    },
    finalStatus: "active",
    consent: null,
  },
];

const mockEmployerProfile = {
  userId: "guest-user-1",
  companyLogo: "",
  companyName: "Demo Hiring Co.",
  establishedYear: 2015,
  businessRegisteredNumber: "DEM0-123456",
  industrySector: "Technology",
  companySize: "51-200",
  workLocation: "Remote-first",
  companyWebsite: "https://demo-hiring.co",
  companyDescription:
    "We are a demo employer profile used to showcase the FitFound UI.",
  contactInfo: {
    profilePicture: "",
    fullName: "Jordan Smith",
    jobTitle: "Talent Lead",
    email: "talent@demo-hiring.co",
    phone: "+1 555-987-6543",
  },
};

// user endpoints
export const userApi = {
  addUser: (data) =>
    USE_MOCK
      ? mockDelay({
          ...data,
          userId: data.role === "employer" ? "mock-employer-1" : "mock-user-1",
          profileId:
            data.role === "employer"
              ? "mock-employer-profile-1"
              : "mock-profile-1",
        })
      : api.post("/user", data),
  getUserByEmail: (data) =>
    USE_MOCK
      ? mockDelay({
          userId: "mock-user-1",
          profileId: "mock-profile-1",
          role: "candidate",
          email: data.email,
        })
      : api.get("/user/byemail", { params: data }),
};

// login endpoints
export const loginApi = {
  loginUser: (data) =>
    USE_MOCK
      ? mockDelay({
          decodedidToken: {
            email: "demo.user@fitfound.com",
            uid: "mock-firebase-uid",
          },
        })
      : api.post("/login", data),
};

// candidate endpoints
export const candidateApi = {
  updateProfile: (userId, data) =>
    USE_MOCK ? mockDelay({ ...mockCandidateProfile, ...data }) : api.patch(`/candidates/${userId}`, data),
  updateSkills: (userId, data) =>
    USE_MOCK
      ? mockDelay({ ...mockCandidateProfile, skills: data.skills || [] })
      : api.patch(`/candidates/${userId}/skills`, data),
  updateWorkHistory: (userId, data) =>
    USE_MOCK
      ? mockDelay({ ...mockCandidateProfile, workHistory: data.workHistory || [] })
      : api.patch(`/candidates/${userId}/work-history`, data),
  updateEducation: (userId, data) =>
    USE_MOCK
      ? mockDelay({ ...mockCandidateProfile, education: data.education || [] })
      : api.patch(`/candidates/${userId}/education`, data),
  updatePersonalInfo: (userId, data) =>
    USE_MOCK
      ? mockDelay({ ...mockCandidateProfile, personalInfo: data })
      : api.patch(`/candidates/${userId}/personal-info`, data),
  updateBasicInfo: (userId, data) =>
    USE_MOCK
      ? mockDelay({ ...mockCandidateProfile, basicInfo: data })
      : api.patch(`/candidates/${userId}/basic-info`, data),
  updatePortfolio: (userId, data) =>
    USE_MOCK
      ? mockDelay({ ...mockCandidateProfile, portfolio: data })
      : api.patch(`/candidates/${userId}/portfolio`, data),
  updateJobPreference: (userId, data) =>
    USE_MOCK
      ? mockDelay({
          ...mockCandidateProfile,
          jobPreference: { ...(mockCandidateProfile.jobPreference || {}), ...data },
        })
      : api.patch(`/candidates/${userId}/job-preference`, data),
  getProfileByUserId: (userId) =>
    USE_MOCK ? mockDelay(mockCandidateProfile) : api.get(`/candidates/user/${userId}`),
  getDashboardMainRoleCounts: () =>
    USE_MOCK
      ? mockDelay([
          { role: "frontend developer", count: 18 },
          { role: "backend developer", count: 12 },
          { role: "fullstack developer", count: 9 },
          { role: "ui designer", count: 7 },
          { role: "ux designer", count: 5 },
        ])
      : api.get(`/candidates/dashboard-main-role-counts`),
  fetchInteractions: (candidateId) =>
    USE_MOCK ? mockDelay(mockInteractions) : api.get(`/interactions/candidate/${candidateId}`),
  setConsent: (interactionId, consent) =>
    USE_MOCK
      ? mockDelay({ ...mockInteractions[0], consent })
      : api.patch(`/interactions/${interactionId}/consent`, { consent }),
  acceptInvitation: (interactionId) =>
    USE_MOCK
      ? mockDelay({ ...mockInteractions[0], consent: true })
      : api.patch(`/interactions/${interactionId}/consent`, { consent: true }),
  declineInvitation: (interactionId) =>
    USE_MOCK
      ? mockDelay({ ...mockInteractions[0], finalStatus: "rejected" })
      : api.patch(`/interactions/${interactionId}/final-status`, {
          status: "rejected",
        }),
  getProfileById: (candidateId) =>
    USE_MOCK ? mockDelay(mockCandidateProfile) : api.get(`/candidates/candidate/${candidateId}`),
  getAppearanceCount: (candidateId) =>
    USE_MOCK
      ? mockDelay([
          { appearances: 10 },
          { appearances: 5 },
        ])
      : api.get(`/insights/visibility-timeline/${candidateId}`),
  getAppearanceInSkills: (candidateId) =>
    USE_MOCK
      ? mockDelay([
          { skill: "React", count: 12 },
          { skill: "Node.js", count: 7 },
        ])
      : api.get(`/insights/skill-breakdown/${candidateId}`),
  getVisibilityTimeline: (candidateId) =>
    USE_MOCK
      ? mockDelay([
          { date: "2024-01-01", appearances: 2 },
          { date: "2024-02-01", appearances: 4 },
        ])
      : api.get(`/insights/visibility-timeline/${candidateId}`),
};

export const jobVerificationApi = {
  verifyJob: (data) =>
    USE_MOCK
      ? mockDelay({ ...data, status: "pending" })
      : api.post("/verification-requests", data),
  getVerificationStatus: (candidateId) =>
    USE_MOCK
      ? mockDelay([
          {
            status: "verified",
            employerProfileId: { companyName: "Demo Hiring Co." },
          },
        ])
      : api.get(`/verification-requests/candidate/${candidateId}`),
};

export const notificationApi = {
  create: (data) =>
    USE_MOCK
      ? mockDelay({ ...data, _id: "mock-notification-1" })
      : api.post("/notifications", data),
  getByUser: (userId) =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "mock-notification-1",
            userId,
            type: "success",
            message: "This is a demo notification.",
            read: false,
          },
        ])
      : api.get(`/notifications/${userId}`),
  getUnreadByUser: (userId) =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "mock-notification-1",
            userId,
            type: "info",
            message: "You have 3 new matches (demo).",
            read: false,
          },
        ])
      : api.get(`/notifications/${userId}/unread`),
  markAsRead: (id) =>
    USE_MOCK
      ? mockDelay({ _id: id, read: true })
      : api.patch(`/notifications/${id}/read`),
};

// employer endpoints
export const employerApi = {
  getAllEmployers: () =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "mock-employer-1",
            companyName: "Demo Hiring Co.",
          },
        ])
      : api.get("/employers"),
  addEmployerProfile: (userId, data) =>
    USE_MOCK
      ? mockDelay({ ...mockEmployerProfile, ...data })
      : api.post(`/employers/${userId}/profile`, data),
  getEmployerProfile: (userId) =>
    USE_MOCK ? mockDelay(mockEmployerProfile) : api.get(`/employers/${userId}/profile`),
  updateEmployerProfile: (userId, data) =>
    USE_MOCK
      ? mockDelay({ ...mockEmployerProfile, ...data })
      : api.patch(`/employers/${userId}/profile`, data),
  updateEmployerContactInfo: (userId, data) =>
    USE_MOCK
      ? mockDelay({
          ...mockEmployerProfile,
          contactInfo: { ...(mockEmployerProfile.contactInfo || {}), ...data },
        })
      : api.patch(`/employers/${userId}/profile`, data),
  saveJob: (data) =>
    USE_MOCK
      ? mockDelay({ ...data, _id: "mock-job-1" })
      : api.post(`/jobs`, data),
  getAllCandidates: () =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "mock-candidate-1",
            name: "Alex Johnson",
            primaryRole: "Frontend Developer",
            score: 87,
          },
        ])
      : api.get(`/candidates`),
  getCandidateById: () =>
    USE_MOCK
      ? mockDelay({ ...mockCandidateProfile, _id: "mock-candidate-1" })
      : api.get(`/candidates/user/6865bb2908ba7790a41621b3`),

  getSearchedCandidates: (searchData) =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "mock-candidate-1",
            score: 92,
            personalInfo: {
              firstName: "Alex",
              lastName: "Johnson",
              specialization: "Frontend Developer",
            },
            basicInfo: {
              workStatus: "workPermit",
            },
            workHistory: mockCandidateProfile.workHistory,
            education: mockCandidateProfile.education,
            jobPreference: {
              salaryExpectation: { min: 55, max: 85 },
            },
            skills: (mockCandidateProfile.skills || []).map((s, idx) =>
              typeof s === "string"
                ? { _id: `skill-a-${idx}`, skill: s }
                : s
            ),
          },
          {
            _id: "mock-candidate-2",
            score: 88,
            personalInfo: {
              firstName: "Sam",
              lastName: "Lee",
              specialization: "Fullstack Developer",
            },
            basicInfo: {
              workStatus: "permanentResident",
            },
            workHistory: mockCandidateProfile.workHistory,
            education: mockCandidateProfile.education,
            jobPreference: {
              salaryExpectation: { min: 60, max: 90 },
            },
            skills: ["React", "Node.js", "Express"].map((s, idx) => ({
              _id: `skill-b-${idx}`,
              skill: s,
            })),
          },
        ])
      : (() => {
          const params = new URLSearchParams();

          if (searchData.title) {
            params.append("title", searchData.title);
          }
          if (searchData.jobType) {
            params.append("jobType", searchData.jobType);
          }
          if (searchData.salaryFrom) {
            params.append("salaryFrom", searchData.salaryFrom);
          }
          // Keep salaryTo for filtering on candidate's 'min' salary.
          if (searchData.salaryTo) {
            params.append("salaryTo", searchData.salaryTo);
          }
          if (searchData.skills) {
            params.append("skills", searchData.skills);
          }

          return api.get(`/candidates/search?${params.toString()}`);
        })(),

  getLastJobSearch: (jobId) =>
    USE_MOCK
      ? mockDelay({
          _id: "mock-job-1",
          jobTitle: "Frontend Developer",
          location: "Toronto, Canada",
          salaryRange: {
            min: 50,
            max: 80,
            perHour: true,
            perYear: false,
          },
          topMatchedCandidates: ["mock-candidate-1", "mock-candidate-2"],
          workEnvironment: "remote",
        })
      : api.get(`/jobs/lastJob/${jobId}`),

  sendConnectionRequest: (data) =>
    USE_MOCK
      ? mockDelay({ ...data, _id: "mock-interaction-1" })
      : api.post(`/interactions`, data),
  fetchCurrentEmployees: (employerId) =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "employee-1",
            candidateId: { name: "Alex Johnson" },
            finalStatus: "hired",
          },
        ])
      : api.get(`/interactions?employerId=${employerId}&finalStatus=hired`),
  fetchAcceptedCandidates: (employerId) =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "accepted-1",
            candidateId: { name: "Sam Lee" },
            consentStatus: "accepted",
          },
        ])
      : api.get(`/interactions/employer/${employerId}?consentStatus=accepted`),
  fetchPendingRequests: (employerId) =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "pending-1",
            candidateId: { name: "Taylor Green" },
            status: "active",
          },
        ])
      : api.get(`/interactions?employerId=${employerId}&status=active`),
  fetchEmployerTasks: (employerId) =>
    USE_MOCK
      ? mockDelay([
          {
            _id: "task-1",
            candidateName: "Alex Johnson",
            is_verified: false,
          },
        ])
      : api.get(`/verification-requests/employer/${employerId}`),
  verifyTask: (taskId) =>
    USE_MOCK
      ? mockDelay({ _id: taskId, is_verified: true })
      : api.patch(`/verification-requests/${taskId}`, { is_verified: true }),
  setCandidateToHired: (interactionId) =>
    USE_MOCK
      ? mockDelay({ _id: interactionId, finalStatus: "hired" })
      : api.patch(`/interactions/${interactionId}/final-status`, {
          status: "hired",
        }),
  saveTopCandidates: (jobId, data) =>
    USE_MOCK
      ? mockDelay({ _id: jobId, ...data })
      : api.patch(`/jobs/${jobId}`, data),
  getLastJob: (employerId) =>
    USE_MOCK
      ? mockDelay({
          _id: "mock-job-1",
          jobTitle: "Frontend Developer",
        })
      : api.get(`/jobs/${employerId}`),
  saveCandidateAppearance: (data) =>
    USE_MOCK
      ? mockDelay({ saved: true })
      : api.post(`/insights/log-bulk-appearance`, data),
};

export { api };
