import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./InterviewResult.css";

function InterviewResult() {

    const location = useLocation();
    const navigate = useNavigate();

    const result = location.state?.result;
    if (!result) return <Navigate to="/history" replace />;

    return (

        <div className="result-container">

            <div className="result-card">

                <h1>Your interview notes</h1>

                <p className="result-subtitle">
                    Scores and feedback from this session.
                </p>

                <div className="overall-score">

                    <h2>{result.overallScore}/100</h2>

                    <p>Overall Score</p>

                </div>

                <div className="score-section">

                    <div>
                        <span>Technical</span>
                        <strong>{result.technicalScore}/100</strong>
                    </div>

                    <div>
                        <span>Problem Solving</span>
                        <strong>{result.problemSolvingScore}/100</strong>
                    </div>

                    <div>
                        <span>Communication</span>
                        <strong>{result.communicationScore}/100</strong>
                    </div>

                    <div>
                        <span>Confidence</span>
                        <strong>{result.confidenceScore}/100</strong>
                    </div>

                </div>

                <div className="feedback-section">

                    <h2>Strengths</h2>

                    {result.strengths?.map((strength, index) => (
                        <p key={index}>
                            ✓ {strength}
                        </p>
                    ))}

                </div>

                <div className="feedback-section">

                    <h2>Areas to Improve</h2>

                    {result.improvements?.map((item, index) => (
                        <p key={index}>
                            • {item}
                        </p>
                    ))}

                </div>

                <div className="feedback-section">

                    <h2>AI Feedback</h2>

                    <p>
                        {result.feedback || "No feedback available."}
                    </p>

                </div>

                <div className="result-actions">

                    <button
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/interview")}
                    >
                        New interview
                    </button>

                </div>

            </div>

        </div>

    );

}

export default InterviewResult;