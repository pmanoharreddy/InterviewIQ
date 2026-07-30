import { useLocation, useNavigate } from "react-router-dom";
import "./InterviewDetails.css";

function InterviewDetails() {

    const navigate = useNavigate();
    const location = useLocation();

    const interview = location.state?.interview;

    if (!interview) {
        return (
            <div className="details-container">

                <h2>No Interview Found</h2>

                <button
                    onClick={() => navigate("/history")}
                >
                    Back
                </button>

            </div>
        );
    }

    return (

        <div className="details-container">

            <div className="details-card">

                <button
                    className="back-btn"
                    onClick={() => navigate("/history")}
                >
                    ← Back
                </button>

                <h1>Interview Details</h1>

                <div className="top-section">

                    <p>
                        <strong>Role:</strong> {interview.role}
                    </p>

                    <p>
                        <strong>Experience:</strong> {interview.experience}
                    </p>

                    <p>
                        <strong>Difficulty:</strong> {interview.difficulty}
                    </p>

                    <p>
                        <strong>Date:</strong>{" "}
                        {new Date(interview.createdAt).toLocaleDateString()}
                    </p>

                </div>

                <div className="score-grid">

                    <div>
                        <h3>Overall</h3>
                        <p>{interview.overallScore}/100</p>
                    </div>

                    <div>
                        <h3>Technical</h3>
                        <p>{interview.technicalScore}/100</p>
                    </div>

                    <div>
                        <h3>Problem Solving</h3>
                        <p>{interview.problemSolvingScore}/100</p>
                    </div>

                    <div>
                        <h3>Communication</h3>
                        <p>{interview.communicationScore}/100</p>
                    </div>

                    <div>
                        <h3>Confidence</h3>
                        <p>{interview.confidenceScore}/100</p>
                    </div>

                </div>

                <div className="section">

                    <h2>Strengths</h2>

                    {(interview.strengths || []).map((item, index) => (

                        <p key={index}>
                            ✓ {item}
                        </p>

                    ))}

                </div>

                <div className="section">

                    <h2>Areas to Improve</h2>

                    {(interview.improvements || []).map((item, index) => (

                        <p key={index}>
                            • {item}
                        </p>

                    ))}

                </div>

                <div className="section">

                    <h2>AI Feedback</h2>

                    <p>{interview.feedback}</p>

                </div>

                <div className="section">

                    <h2>Conversation</h2>

                    {(interview.conversation || []).map((item, index) => (

                        <div
                            key={index}
                            className="conversation-item"
                        >

                            <h3>
                                Question {index + 1}
                            </h3>

                            <p>
                                <strong>Q:</strong>{" "}
                                {item.question}
                            </p>

                            <p>
                                <strong>Your Answer:</strong>{" "}
                                {item.answer}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}

export default InterviewDetails;