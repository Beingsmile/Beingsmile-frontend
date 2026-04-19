import { useContext } from "react";
import { Navigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../contexts/AuthProvider";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext)

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <Navigate to="/" replace />
    }

    return children;
};

export default PrivateRoute;