import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // If user not logged in-> send to login page
  if (!user) return <Navigate to="/login" />;

  // If role is required and user role doesn't match -> block access
  if (role && user.role !== role) return <Navigate to="/unauthorized" />;

  // Otherwise, allow access
  return children;
};

export default ProtectedRoute;
