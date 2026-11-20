import { useEffect, useState } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader/Loader";

import { API_URL } from "../config";

function ProtectedRoute({ children }) {

    const [error, setError] = useState(false);
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

                if (err.response?.status !== 401) setError(true);
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

    if (error) {
        return <main className="details-container"><div className="details-card">
            <h1>Unable to check your session</h1>
            <p>Check your connection and try again.</p>
            <button className="back-btn" onClick={() => window.location.reload()}>Try again</button>
        </div></main>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <header className="masthead">
                <nav className="workspace-nav wrap" aria-label="Practice navigation">
                    <Link className="wordmark" to="/dashboard">InterviewIQ</Link>
                    <NavLink to="/dashboard">Journal</NavLink>
                    <NavLink to="/history">History</NavLink>
                </nav>
            </header>
            {children}
        </>
    );
}

export default ProtectedRoute;
