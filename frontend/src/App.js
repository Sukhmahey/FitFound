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
import EmployerSearch from "./pages/employer/Search";
import EmployerSearchResults from "./pages/employer/SearchResults";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

      {/* Candidate Routes */}
      <Route
        path="/candidate/onboarding"
        element={
          <ProtectedRoute role="candidate">
            <CandidateOnboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute role="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/profile"
        element={
          <ProtectedRoute role="candidate">
            <MyProfile></MyProfile>
          </ProtectedRoute>
        }
      />

      {/* Employer Routes */}
      <Route
        path="/employer/onboarding"
        element={
          <ProtectedRoute role="employer">
            <EmployerOnboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/profile"
        element={
          <ProtectedRoute role="employer">
            <EmployerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/create-form"
        element={
          <ProtectedRoute role="employer">
            <EmployerJobForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute role="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/search"
        element={
          <ProtectedRoute role="employer">
            <EmployerSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/searchResults"
        element={
          <ProtectedRoute role="employer">
            <EmployerSearchResults />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
