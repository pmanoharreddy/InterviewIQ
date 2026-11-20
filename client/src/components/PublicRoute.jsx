import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader/Loader";

import { API_URL } from "../config";

function PublicRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            try {

                await axios.get(
                    `${API_URL}/api/auth/profile`,
                    {
                        withCredentials: true,
                    }
                );

                setAuthenticated(true);

            } catch {

                setAuthenticated(false);

            } finally {

                setLoading(false);

            }

        };

        checkAuth();

    }, []);

    if (loading) {
        return (
            <Loader message="Loading..." />
        );
    }

    if (authenticated) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}

export default PublicRoute;