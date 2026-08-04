import { useState } from "react";
import "./InterviewSession.css";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function InterviewSession() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        firstQuestion,
        interviewType,
        role,
        topic,
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

            const response = await axios.post(
                `${API_URL}/api/interview/answer`,
                {
                    currentQuestion,
                    answer,
                    conversation,
                    interviewType,
                    role,
                    topic,
                    experience,
                    difficulty,
                    questionNumber,
                },
                {
                    withCredentials: true,
                }
            );

            const data = response.data;

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

                const evaluationResponse = await axios.post(
                    `${API_URL}/api/interview/evaluate`,
                    {
                        interviewType,
                        role,
                        topic,
                        experience,
                        difficulty,
                        conversation: updatedConversation,
                    },
                    {
                        withCredentials: true,
                    }
                );

                const evaluationData = evaluationResponse.data;

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

            if (error.response) {
                console.error(error.response.data.message);
                alert(error.response.data.message);
            } else {
                console.error(error.message);
                alert("Something went wrong.");
            }

        }

    };

    if (loading) {
        return <Loader message={loadingMessage} />;
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