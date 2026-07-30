import { useLocation, useNavigate } from "react-router-dom";
import "./InterviewResult.css";

function InterviewResult() {

    const location = useLocation();
    const navigate = useNavigate();

    const result = location.state?.result || {
        overallScore: 78,
        technicalScore: 82,
        problemSolvingScore: 76,
        communicationScore: 74,
        confidenceScore: 80,

        strengths: [
            "Good understanding of REST APIs",
            "Strong Node.js and Express fundamentals",
            "Explains technical concepts clearly",
        ],

        improvements: [
            "Improve database optimization knowledge",
            "Explain time and space complexity more clearly",
            "Practice discussing edge cases",
        ],

        feedback:
            "You demonstrated solid full-stack development fundamentals. Focus on optimization, edge cases, and deeper database concepts to improve your interview performance.",
    };

    return (

        <div className="result-container">

            <div className="result-card">

                <h1>Interview Complete</h1>

                <p className="result-subtitle">
                    Here's how you performed
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
                        Try Again
                    </button>

                </div>

            </div>

        </div>

    );

}

export default InterviewResult;