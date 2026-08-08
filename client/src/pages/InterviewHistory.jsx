import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import "./InterviewHistory.css";

const API_URL = import.meta.env.VITE_API_URL;

function InterviewHistory() {

    const [interviews, setInterviews] = useState([]);
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
                    console.error(data.message);
                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchHistory();

    }, []);

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


                <h1>Interview History</h1>


                {
                    interviews.length === 0 ? (

                        <p>No interviews found.</p>

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