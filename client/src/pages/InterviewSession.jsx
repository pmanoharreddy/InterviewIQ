import { useState } from "react";
import "./InterviewSession.css";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import axios from "axios";

import { API_URL } from "../config";

function InterviewSession() {

    const location = useLocation();
    const navigate = useNavigate();

    const session = location.state || {};
    const { firstQuestion, interviewId, interviewType, role, topic, experience, difficulty, resumeText,
        currentQuestion = firstQuestion, questionNumber = 1, conversation = [], evaluationPending = false } = session;
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [loadingMessage, setLoadingMessage] = useState("");
    const loading = Boolean(loadingMessage);

    const saveProgress = progress => navigate(location.pathname, {
        replace: true, state: { ...session, ...progress },
    });

    const evaluate = async turns => {
        setLoadingMessage("Preparing your feedback...");
        const { data } = await axios.post(`${API_URL}/api/interview/evaluate`, {
            interviewId, interviewType, role, experience, difficulty, conversation: turns,
        }, { withCredentials: true });
        navigate("/interview-result", { replace: true, state: { result: data.result } });
    };

    const handleSubmit = async () => {
        if (loading || (!evaluationPending && !answer.trim())) return;
        setError("");
        try {
            if (evaluationPending) {
                await evaluate(conversation);
                return;
            }
            setLoadingMessage("Reviewing your answer...");
            const { data } = await axios.post(`${API_URL}/api/interview/answer`, {
                currentQuestion, answer, conversation: conversation.slice(-4), interviewType, role,
                experience, difficulty, questionNumber, resumeText,
            }, { withCredentials: true });
            const turns = [...conversation, { question: currentQuestion, answer }];
            if (data.type === "END_INTERVIEW") {
                saveProgress({ conversation: turns, evaluationPending: true });
                await evaluate(turns);
            } else {
                saveProgress({
                    conversation: turns, currentQuestion: data.nextQuestion,
                    questionNumber: data.type === "NEXT_QUESTION" ? questionNumber + 1 : questionNumber,
                    followUp: data.type === "FOLLOW_UP",
                });
                setAnswer("");
            }
        } catch (err) {
            setError(err.response?.data?.message || "The request could not finish. Try again.");
        } finally {
            setLoadingMessage("");
        }
    };

    if (!firstQuestion) return <Navigate to="/interview" replace />;

    if (loading) {
        return <Loader message={loadingMessage} />;
    }

    return (

        <div className="session-container">

            <div className="session-card">

                <div className="header">

                    <h1>InterviewIQ</h1>

                    <span>
                        Question {questionNumber} / 10{session.followUp && " - Follow-up"}
                    </span>

                </div>

                <div className="details">

                    <p>
                        <strong>Interview Type:</strong> {interviewType}
                    </p>

                    {interviewType === "Technical" && (
                        <p>
                            <strong>Role:</strong> {role}
                        </p>
                    )}

                    {interviewType === "DSA" && (
                        <p>
                            <strong>Topic:</strong> {topic || "Mixed"}
                        </p>
                    )}

                    <p>
                        <strong>Experience:</strong> {experience}
                    </p>

                    <p>
                        <strong>Difficulty:</strong> {difficulty}
                    </p>

                </div>

                <div className="question-card">

                    <h2>AI Interviewer</h2>

                    <p>{currentQuestion}</p>

                </div>

                {evaluationPending ? <p>Your answers are ready for evaluation.</p> : <div className="answer-section">

                    <label htmlFor="interview-answer">Your answer</label>

                    <textarea
                        id="interview-answer"
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />

                </div>}

                {error && <p className="error" role="alert">{error}</p>}
                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={loading || (!evaluationPending && !answer.trim())}
                >
                    {evaluationPending ? "Get my feedback" : "Submit answer"}
                </button>

            </div>

        </div>

    );

}

export default InterviewSession;