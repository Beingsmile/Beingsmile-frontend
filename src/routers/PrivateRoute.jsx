import { useContext } from "react";
import { Navigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../contexts/AuthProvider";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext)

    if(!user && !loading) return  <Navigate to="/" replace />

    if(loading) <LoadingSpinner />

    return (
        children
    );
};

export default PrivateRoute;