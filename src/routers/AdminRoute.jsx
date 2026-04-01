import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../contexts/AuthProvider";
import { FiLoader } from "react-icons/fi";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="text-4xl text-primary animate-spin" />
      </div>
    );
  }

  // Check if user is logged in AND has admin role
  // user.data refers to the backend user object attached to the firebase user
  if (user && user.data?.role === "admin") {
    return children;
  }

  // Redirect to home if not admin
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
