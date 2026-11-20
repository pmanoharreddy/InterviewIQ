import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import "./Dashboard.css";

import { API_URL } from "../config";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [recentInterviews, setRecentInterviews] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const getDashboard = async () => {

            try {

                const userResponse = await axios.get(
                    `${API_URL}/api/auth/profile`,
                    {
                        withCredentials: true
                    }
                );

                setUser(userResponse.data.user);


                const dashboardResponse = await axios.get(
                    `${API_URL}/api/interview/dashboard`,
                    {
                        withCredentials: true
                    }
                );

                setAnalytics(dashboardResponse.data.analytics);

                setRecentInterviews(
                    dashboardResponse.data.recentInterviews
                );

            } catch (error) {

                if (error.response?.status === 401) navigate("/login", { replace: true });
                else setError("Your dashboard could not be loaded.");

            } finally {

                setLoading(false);

            }

        };

        getDashboard();

    }, [navigate]);


    const handleLogout = async () => {

        try {

            await axios.post(
                `${API_URL}/api/auth/logout`,
                {},
                {
                    withCredentials: true
                }
            );

            navigate("/login");

        } catch {

            setError("Logout failed. Please try again.");

        }

    };


    if (loading) {
        return <Loader message="Loading Dashboard..." />;
    }


    if (error) return <main className="dashboard-container"><div className="dashboard-content">
        <p role="alert">{error}</p>
        <button className="secondary-button" onClick={() => window.location.reload()}>Reload dashboard</button>
    </div></main>;

    return (

        <div className="dashboard-container">

            <div className="dashboard-content">

                {/* Header */}

                <div className="dashboard-header">

                    <div className="welcome-area">
                        <h1>Practice journal</h1>

                        <p>{user?.email}</p>
                    </div>

                    <Link
                        to="/interview"
                        className="start-interview-btn"
                    >
                        New interview
                    </Link>

                </div>


                {/* Analytics */}

                <div className="analytics-grid">

                    <div className="analytics-box">
                        <p>Interviews completed</p>
                        <h2>
                            {analytics?.totalInterviews || 0}
                        </h2>
                    </div>


                    <div className="analytics-box">
                        <p>Average score</p>
                        <h2>
                            {analytics?.totalInterviews ? analytics.averageScore : "—"}
                        </h2>
                    </div>


                    <div className="analytics-box">
                        <p>Highest score</p>
                        <h2>
                            {analytics?.totalInterviews ? analytics.highestScore : "—"}
                        </h2>
                    </div>


                    <div className="analytics-box">
                        <p>Latest score</p>
                        <h2>
                            {analytics?.totalInterviews ? analytics.latestScore : "—"}
                        </h2>
                    </div>

                </div>


                {/* Recent interviews */}

                <div className="recent-section">

                    <div className="section-heading">

                        <div>

                            <h2>Recent interviews</h2>

                        </div>


                        <button
                            className="history-link"
                            onClick={() => navigate("/history")}
                        >
                            View all
                        </button>

                    </div>


                    <div className="interview-list">

                        {recentInterviews.length === 0 ? (

                            <div className="empty-message">
                                Your first completed interview will appear here.
                            </div>

                        ) : (

                            recentInterviews.map((interview) => (

                                <div
                                    className="interview-row"
                                    key={interview._id}
                                >

                                    <div>

                                        <h3>

                                            {interview.interviewType === "Technical"
                                                ? interview.role
                                                : interview.interviewType === "Resume"
                                                    ? "Resume Interview"
                                                    : interview.interviewType === "DSA"
                                                        ? "DSA Interview"
                                                        : "HR Interview"}

                                        </h3>


                                        <p>
                                            {interview.difficulty}
                                            {" • "}
                                            {interview.experience}
                                        </p>

                                    </div>


                                    <div className="score">

                                        <strong>
                                            {interview.overallScore}
                                        </strong>

                                        <span>/100</span>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>


                {/* Bottom Buttons */}

                <div className="dashboard-buttons">

                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Sign out
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;