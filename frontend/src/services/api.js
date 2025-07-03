import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// user endpoints
export const userApi = {
  addUser: (data) => api.post("/user", data),
  getUserByEmail: (data) => api.get("/user/byemail", { params: data }),
};

// login endpoints
export const loginApi = {
  loginUser: (data) => api.post("/login", data),
};

// candidate endpoints
export const candidateApi = {
  updateProfile: (userId, data) => api.patch(`/candidates/${userId}`, data),
  updateSkills: (userId, data) =>
    api.patch(`/candidates/${userId}/skills`, data),
  updateWorkHistory: (userId, data) =>
    api.patch(`/candidates/${userId}/work-history`, data),
  updateEducation: (userId, data) =>
    api.patch(`/candidates/${userId}/education`, data),
  updatePersonalInfo: (userId, data) =>
    api.patch(`/candidates/${userId}/personal-info`, data),
  updateBasicInfo: (userId, data) =>
    api.patch(`/candidates/${userId}/basic-info`, data),
  updatePortfolio: (userId, data) =>
    api.patch(`/candidates/${userId}/portfolio`, data),
  updateJobPreference: (userId, data) =>
    api.patch(`/candidates/${userId}/job-preference`, data),
  getProfileByUserId: (userId) => api.get(`/candidates/user/${userId}`),
  getDashboardMainRoleCounts: () =>
    api.get(`/candidates/dashboard-main-role-counts`),
  fetchInteractions: (candidateId) =>
    api.get(`/interactions/candidate/${candidateId}`),
  setConsent: (interactionId, consent) =>
    api.patch(`/interactions/${interactionId}/consent`, { consent }),
  acceptInvitation: (interactionId) =>
    api.patch(`/interactions/${interactionId}/consent`, { consent: true }),
  declineInvitation: (interactionId) =>
    api.patch(`/interactions/${interactionId}`, { finalStatus: "rejected" }),
};

export const jobVerificationApi = {
  verifyJob: (data) => api.post("/verification-requests", data),
};

// employer endpoints
export const employerApi = {
  addEmployerProfile: (userId, data) =>
    api.post(`/employers/${userId}/profile`, data),
  getEmployerProfile: (userId) => api.get(`/employers/${userId}/profile`),
  updateEmployerProfile: (userId, data) =>
    api.patch(`/employers/${userId}/profile`, data),
  updateEmployerContactInfo: (userId, data) =>
    api.patch(`/employers/${userId}/profile`, data),
  saveJob: (data) => api.post(`/jobs`, data),
  getAllCandidates: () => api.get(`/candidates`),
  getCandidateById: () => api.get(`/candidates/user/6865bb2908ba7790a41621b3`),
  getSearchedCandidates: (data) =>
    api.get(
      `/candidates?title=${data.title}&jobType=${data.jobType}&location=${data.location}&salaryFrom=${data.salaryFrom}&salaryTo=${data.salaryTo}&jobDescriptionKeywords=${data.jobDescription}&workStatus=${data.workStatus}&skills=${data.skills}`
    ),

  sendConnectionRequest: (data) => api.post(`/interactions`, data),
  fetchCurrentEmployees: (employerId) =>
    api.get(`/interactions?employerId=${employerId}&finalStatus=hired`),
  fetchAcceptedCandidates: (employerId) =>
    api.get(`/interactions/employer/${employerId}?consentStatus=accepted`),
  fetchPendingRequests: (employerId) =>
    api.get(`/interactions?employerId=${employerId}&status=active`),
  fetchEmployerTasks: (employerId) =>
    api.get(`/verification-requests/employer/${employerId}`),
  verifyTask: (taskId) =>
    api.patch(`/verification-requests/${taskId}`, { is_verified: true }),
  setCandidateToHired: (interactionId) =>
    api.patch(`/interactions/${interactionId}/final-status`, {
      status: "hired",
    }),
  saveTopCandidates: (jobId, data) => api.patch(`/jobs/${jobId}`, data),
};

export { api };
