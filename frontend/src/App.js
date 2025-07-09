import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CandidateOnboarding from "./pages/candidate/Onboarding";
import CandidateDashboard from "./pages/candidate/Dashboard";
import EmployerOnboarding from "./pages/employer/Onboarding";
import EmployerJobForm from "./pages/employer/JobForm";
import EmployerDashboard from "./pages/employer/Dashboard";
import EmployerProfile from "./pages/employer/Profile";
import MyProfile from "./pages/candidate/MyProfile";
import CandidateConnections from "./pages/candidate/Connections";
import EmployerSearch from "./pages/employer/Search";
import EmployerSearchResults from "./pages/employer/SearchResults";
import EmployerConnections from "./pages/employer/Connections";
import Unauthorized from "./pages/Unauthorized";
import ExperienceVerificationReqPage from "./pages/candidate/ExperienceVerificationReqPage";
import MainLayout from "./components/MainLayout";
import SettingsPage from "./pages/candidate/SettingsPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationList from "./pages/NotificationList";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications-list" element={<NotificationList></NotificationList>}></Route>
        <Route path="/candidate/onboarding" element={<CandidateOnboarding />} />
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        
        {/* Candidate Routes */}
        <Route
          path="/candidate"
          element={
          <ProtectedRoute role="candidate">
            <MainLayout />
          </ProtectedRoute>
          }
        >
          <Route path="settings" element={<SettingsPage />} />

          {/* <Route
            path="onboarding"
            element={
              <CandidateOnboarding />
            }
          /> */}
          <Route
            path="dashboard"
            element={
              <CandidateDashboard />
            }
          />
          <Route
            path="/candidate/profile"
            element={
              <MyProfile></MyProfile>
            }
          />
          <Route
            path="/candidate/connections"
            element={
              <CandidateConnections />
            }
          />
          <Route
            path="/candidate/badge-verification"
            element={
              <ExperienceVerificationReqPage></ExperienceVerificationReqPage>
            }
          />
        </Route>
        {/* Employer Routes */}
        <Route
          path="/employer"
          element={
            <ProtectedRoute role="employer">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="settings" element={<SettingsPage />} />

          <Route path="onboarding" element={<EmployerOnboarding />} />
          <Route path="profile" element={<EmployerProfile />} />
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="search" element={<EmployerSearch />} />
          <Route path="connections" element={<EmployerConnections />} />
          <Route
            path="searchResults"
            element={<EmployerSearchResults />
            }
          />
        </Route>
        <Route
          path="/employer/create-form"
          element={
            <ProtectedRoute role="employer">
              <EmployerJobForm />
            </ProtectedRoute>
          }
        />
      
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>

    
  );
}

export default App;
