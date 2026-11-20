import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import "./InterviewHistory.css";

import { API_URL } from "../config";

function InterviewHistory() {

    const [interviews, setInterviews] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const response = await fetch(
                    `${API_URL}/api/interview/history`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setInterviews(data.interviews);
                } else {
                    if (response.status === 401) navigate("/login", { replace: true });
                    else setError(data.message || "Your history could not be loaded.");
                }

            } catch {
                setError("Your history could not be loaded. Check your connection and try again.");

            } finally {

                setLoading(false);

            }

        };

        fetchHistory();

    }, [navigate]);

    if (loading) {
        return (
            <Loader message="Loading interview history..." />
        );
    }

    return (

        <div className="history-container">

            <div className="history-card">

                {/* Back button */}

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>


                <h1>Interview history</h1>


                {
                    error ? <div><p role="alert">{error}</p>
                        <button className="back-button" onClick={() => window.location.reload()}>Try again</button>
                    </div> : interviews.length === 0 ? (

                        <p>Your completed interviews and feedback will appear here.</p>

                    ) : (

                        interviews.map((interview) => (

                            <div
                                className="history-item"
                                key={interview._id}
                            >

                                <div>

                                    <h2>
                                        {interview.role ||
                                            `${interview.interviewType} Interview`}
                                    </h2>

                                </div>


                                <div className="history-score">

                                    <h2>
                                        {interview.overallScore}/100
                                    </h2>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/interview-details",
                                                {
                                                    state: {
                                                        interview,
                                                    },
                                                }
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>

                        ))

                    )
                }

            </div>

        </div>

    );
}

export default InterviewHistory;