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
  getSearchedCandidates: (data) =>
    api.get(
      `/candidates?title=${data.title}&jobType=${data.jobType}&location=${data.location}&salaryFrom=${data.salaryFrom}&salaryTo=${data.salaryTo}&jobDescriptionKeywords=${data.jobDescription}&workStatus=${data.workStatus}&skills=${data.skills}`
    ),

  sendConnectionRequest: (data) => api.post(`/interactions`, data),
  fetchCurrentEmployees: (employerId) =>
    api.get(`/interactions?employerId=${employerId}&finalStatus=hired`),
  fetchAcceptedCandidates: (employerId) =>
    api.get(`/interactions/employer/${employerId}?consentStatus=accepted`),
};

export { api };
