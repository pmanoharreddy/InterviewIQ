import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [recentInterviews, setRecentInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const profileResponse = await axios.get(
                    `${API_URL}/api/auth/profile`,
                    {
                        withCredentials: true,
                    }
                );

                setUser(profileResponse.data.user);

                const dashboardResponse = await axios.get(
                    `${API_URL}/api/interview/dashboard`,
                    {
                        withCredentials: true,
                    }
                );

                setAnalytics(dashboardResponse.data.analytics);
                setRecentInterviews(dashboardResponse.data.recentInterviews);

            } catch (err) {

                console.log(err.response?.data || err.message);

                navigate("/login");

            } finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, [navigate]);

    const handleLogout = async () => {

        try {

            await axios.post(
                `${API_URL}/api/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            navigate("/login");

        } catch (err) {

            console.log(err.response?.data || err.message);

        }

    };

    if (loading) {
        return <Loader message="Loading Dashboard..." />;
    }

    return (

        <div className="dashboard-container">

            <div className="dashboard-card">

                <h1>Welcome Back 👋</h1>

                <p className="welcome-text">
                    {user?.email}
                </p>

                <div className="analytics-grid">

                    <div className="analytics-box">
                        <h3>Total Interviews</h3>
                        <h2>{analytics?.totalInterviews}</h2>
                    </div>

                    <div className="analytics-box">
                        <h3>Average Score</h3>
                        <h2>{analytics?.averageScore}</h2>
                    </div>

                    <div className="analytics-box">
                        <h3>Highest Score</h3>
                        <h2>{analytics?.highestScore}</h2>
                    </div>

                    <div className="analytics-box">
                        <h3>Latest Score</h3>
                        <h2>{analytics?.latestScore}</h2>
                    </div>

                </div>

                <div className="recent-section">

                    <h2>Recent Interviews</h2>

                    {
                        recentInterviews.length === 0 ?

                            <p>No interviews yet.</p>

                            :

                            recentInterviews.map(interview => (

                                <div
                                    key={interview._id}
                                    className="recent-item"
                                >

                                    <div>

                                        <h3>{interview.role}</h3>

                                        <p>
                                            {interview.difficulty}
                                        </p>

                                    </div>

                                    <strong>
                                        {interview.overallScore}/100
                                    </strong>

                                </div>

                            ))
                    }

                </div>

                <div className="dashboard-buttons">

                    <Link
                        to="/interview"
                        className="dashboard-btn"
                    >
                        Start Interview
                    </Link>

                    <button
                        onClick={() => navigate("/history")}
                    >
                        Interview History
                    </button>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;