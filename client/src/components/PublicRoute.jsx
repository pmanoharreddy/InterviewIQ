import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

function PublicRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function checkSession() {
            try {
                const { data } = await axios.get(`${API_URL}/api/auth/profile`, {
                    withCredentials: true,
                    signal: controller.signal,
                });
                if (!controller.signal.aborted && data?.user) {
                    setAuthenticated(true);
                }
            } catch {
                // Visitors can use public pages even while the API is unavailable.
            }
        }

        checkSession();
        return () => controller.abort();
    }, []);

    return authenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default PublicRoute;
