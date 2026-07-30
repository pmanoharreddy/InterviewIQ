import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader/Loader";

const API_URL = import.meta.env.VITE_API_URL;

function ProtectedRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            try {

                await axios.get(
                    `${API_URL}/api/auth/profile`,
                    {
                        withCredentials: true,
                    }
                );

                setIsAuthenticated(true);

            } catch (err) {

                setIsAuthenticated(false);

            } finally {

                setLoading(false);

            }

        };

        checkAuth();

    }, []);

    if (loading) {
        return (
            <Loader message="Checking authentication..." />
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;