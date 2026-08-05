import { useState } from "react";
import "./Interview.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Interview() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        interviewType: "Technical",
        role: "",
        experience: "",
        difficulty: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "interviewType") {
            setFormData({
                interviewType: value,
                role: "",
                experience: formData.experience,
                difficulty: formData.difficulty,
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.experience || !formData.difficulty) {
            alert("Please fill all fields");
            return;
        }

        if (
            formData.interviewType === "Technical" &&
            !formData.role
        ) {
            alert("Please select a role");
            return;
        }

        try {
            setLoading(true);

            console.log("Sending:", formData);

            const response = await axios.post(
                `${API_URL}/api/interview/start`,
                formData,
                {
                    withCredentials: true,
                }
            );

            navigate("/interview/session", {
                state: {
                    firstQuestion: response.data.question,
                    ...formData,
                },
            });
        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("Failed to start interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="interview-container">
            <div className="interview-card">
                <h1>AI Interview</h1>

                <p className="subtitle">
                    Configure your interview and get started.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Interview Type */}

                    <div className="form-group">
                        <label>Interview Type</label>

                        <select
                            name="interviewType"
                            value={formData.interviewType}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="Technical">
                                Technical Interview
                            </option>

                            <option value="DSA">
                                DSA Interview
                            </option>

                            <option value="HR">
                                HR Interview
                            </option>

                            <option value="Resume">
                                Resume Interview
                            </option>
                        </select>
                    </div>

                    {/* Role */}

                    {formData.interviewType === "Technical" && (
                        <div className="form-group">
                            <label>Role</label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">
                                    Select Role
                                </option>

                                <option value="Frontend Developer">
                                    Frontend Developer
                                </option>

                                <option value="Backend Developer">
                                    Backend Developer
                                </option>

                                <option value="Full Stack Developer">
                                    Full Stack Developer
                                </option>

                                <option value="Java Developer">
                                    Java Developer
                                </option>
                            </select>
                        </div>
                    )}

                    {/* Experience */}

                    <div className="form-group">
                        <label>Experience</label>

                        <select
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">
                                Select Experience
                            </option>

                            <option value="Fresher">
                                Fresher
                            </option>

                            <option value="0-2 Years">
                                0-2 Years
                            </option>

                            <option value="2-5 Years">
                                2-5 Years
                            </option>
                        </select>
                    </div>

                    {/* Difficulty */}

                    <div className="form-group">
                        <label>Difficulty</label>

                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">
                                Select Difficulty
                            </option>

                            <option value="Easy">
                                Easy
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="Hard">
                                Hard
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="start-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Generating Questions...
                            </>
                        ) : (
                            "Start Interview"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Interview;