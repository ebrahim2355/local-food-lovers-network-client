import React, { use } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading. Please wait…
                </p>
            </div>
        );
    }

    if (user) {
        return children;
    }

    return (
        <Navigate
            to="/login"
            state={{ from: location.pathname }}
            replace
        />
    );
};

export default PrivateRoute;
