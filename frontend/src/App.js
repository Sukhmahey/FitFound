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
import EmployerConnections from "./pages/employer/Connections";
import Unauthorized from "./pages/Unauthorized";
import ExperienceVerificationReqPage from "./pages/candidate/ExperienceVerificationReqPage";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
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
        path="/candidate/badge-verification"
        element={
          <ProtectedRoute role="candidate">
            <ExperienceVerificationReqPage></ExperienceVerificationReqPage>
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
      <Route path="/employer"
        element={
          <ProtectedRoute role="employer">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="onboarding"
          element={<EmployerOnboarding />}
        />

        <Route
          path="profile"
          element={<EmployerProfile />}
        />

        <Route
          path="dashboard"
          element={<EmployerDashboard />
          }
        />

        <Route
          path="search"
          element={ <EmployerSearch />}
        />

      <Route
        path="/employer/connections"
        element={<EmployerConnections />}
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
