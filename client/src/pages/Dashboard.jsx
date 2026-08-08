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

                console.log(error);

                navigate("/login");

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

        } catch (error) {

            console.log(error);

        }

    };


    if (loading) {
        return <Loader message="Loading Dashboard..." />;
    }


    return (

        <div className="dashboard-container">

            <div className="dashboard-content">

                {/* Header */}

                <div className="dashboard-header">

                    <div>
                        <h1>Welcome back</h1>

                        <p>{user?.email}</p>
                    </div>

                    <Link
                        to="/interview"
                        className="start-interview-btn"
                    >
                        Start Interview
                    </Link>

                </div>


                {/* Analytics */}

                <div className="analytics-grid">

                    <div className="analytics-box">
                        <p>Total Interviews</p>
                        <h2>
                            {analytics?.totalInterviews || 0}
                        </h2>
                    </div>


                    <div className="analytics-box">
                        <p>Average Score</p>
                        <h2>
                            {analytics?.averageScore || 0}
                        </h2>
                    </div>


                    <div className="analytics-box">
                        <p>Highest Score</p>
                        <h2>
                            {analytics?.highestScore || 0}
                        </h2>
                    </div>


                    <div className="analytics-box">
                        <p>Latest Score</p>
                        <h2>
                            {analytics?.latestScore || 0}
                        </h2>
                    </div>

                </div>


                {/* Recent Interviews */}

                <div className="recent-section">

                    <div className="section-heading">

                        <div>

                            <h2>Recent Interviews</h2>

                            <p>
                                Your latest interview performance
                            </p>

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
                                No interviews yet.
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

                    <Link
                        to="/interview"
                        className="primary-button"
                    >
                        Start Interview
                    </Link>


                    <button
                        onClick={() => navigate("/history")}
                        className="secondary-button"
                    >
                        Interview History
                    </button>


                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;