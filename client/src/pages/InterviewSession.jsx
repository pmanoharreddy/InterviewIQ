import { useState } from "react";
import "./InterviewSession.css";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";

const API_URL = import.meta.env.VITE_API_URL;

function InterviewSession() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        firstQuestion,
        role,
        experience,
        difficulty,
    } = location.state || {};

    const [answer, setAnswer] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(firstQuestion);

    const [questionNumber, setQuestionNumber] = useState(10);

    const [conversation, setConversation] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const handleSubmit = async () => {

        if (!answer.trim()) return;

        try {

            setLoading(true);
            setLoadingMessage("Analyzing your answer...");

            const response = await fetch(
                `${API_URL}/api/interview/answer`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        currentQuestion,
                        answer,
                        conversation,
                        role,
                        experience,
                        difficulty,
                        questionNumber,
                    }),
                }
            );

            const data = await response.json();

            console.log("Backend response:", data);

            if (!response.ok) {
                setLoading(false);
                console.error(data.message);
                return;
            }

            const updatedConversation = [
                ...conversation,
                {
                    question: currentQuestion,
                    answer,
                },
            ];

            setConversation(updatedConversation);

            if (data.type === "END_INTERVIEW") {

                setLoadingMessage("Evaluating your interview...");

                const evaluationResponse = await fetch(
                    `${API_URL}/api/interview/evaluate`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                        },

                        credentials: "include",

                        body: JSON.stringify({
                            role,
                            experience,
                            difficulty,
                            conversation: updatedConversation,
                        }),
                    }
                );

                const evaluationData = await evaluationResponse.json();

                if (!evaluationResponse.ok) {
                    setLoading(false);
                    console.error(evaluationData.message);
                    return;
                }

                setLoading(false);

                navigate("/interview-result", {
                    state: {
                        result: evaluationData.result,
                    },
                });

                return;
            }

            setCurrentQuestion(data.nextQuestion);

            if (data.type === "NEXT_QUESTION") {
                setQuestionNumber((prev) => prev + 1);
            }

            setAnswer("");

            setLoading(false);

        } catch (error) {

            setLoading(false);

            console.error("Error submitting answer:", error);

        }

    };

    if (loading) {
        return (
            <Loader message={loadingMessage} />
        );
    }

    return (

        <div className="session-container">

            <div className="session-card">

                <div className="header">

                    <h1>InterviewIQ</h1>

                    <span>
                        Question {questionNumber} / 10
                    </span>

                </div>

                <div className="details">

                    <p>
                        <strong>Role:</strong> {role}
                    </p>

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

                <div className="answer-section">

                    <label>Your Answer</label>

                    <textarea
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />

                </div>

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Please Wait..." : "Submit Answer"}
                </button>

            </div>

        </div>

    );

}

export default InterviewSession;