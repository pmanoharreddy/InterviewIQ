import { useState } from "react";
import "./Interview.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config";

function Interview() {
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        interviewType: "Technical",
        role: "",
        experience: "",
        difficulty: "",
        resume: null,
    });

    const handleChange = (e) => {
        setError("");
        const { name, value } = e.target;

        if (name === "interviewType") {
            setFormData({
                interviewType: value,
                role: "",
                experience: formData.experience,
                difficulty: formData.difficulty,
                resume: null,
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

        setError("");
        if (formData.resume?.size > 5 * 1024 * 1024) {
            setError("Choose a PDF that is 5 MB or smaller.");
            return;
        }
        try {
            setLoading(true);
            const data = new FormData();

            data.append("interviewType", formData.interviewType);
            data.append("role", formData.role);
            data.append("experience", formData.experience);
            data.append("difficulty", formData.difficulty);

            if (formData.resume) {
                data.append("resume", formData.resume);
            }

            const response = await axios.post(
                `${API_URL}/api/interview/start`,
                data,
                {
                    withCredentials: true,
                }
            );

            navigate("/interview/session", {
                state: {
                    firstQuestion: response.data.question,
                    resumeText: response.data.resumeText,
                    interviewId: response.data.interviewId,
                    interviewType: formData.interviewType,
                    experience: formData.experience,
                    difficulty: formData.difficulty,
                    role: formData.role,
                },
            });
        } catch (err) {
            setError(err.response?.data?.message || "Could not start the interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="interview-container">
            <div className="interview-card">
                <h1>Set up your interview</h1>

                <p className="subtitle">
                    Choose what you want to practice. Each interview has ten main questions.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Interview Type */}

                    <div className="form-group">
                        <label htmlFor="interviewType">Interview Type</label>

                        <select
                            required
                            id="interviewType"
                            name="interviewType"
                            value={formData.interviewType}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="Technical">
                                Technical
                            </option>

                            <option value="DSA">
                                Algorithms (DSA)
                            </option>

                            <option value="HR">
                                Behavioral (HR)
                            </option>

                            <option value="Resume">
                                Resume
                            </option>
                        </select>
                    </div>

                    {/* Role */}

                    {formData.interviewType === "Technical" && (
                        <div className="form-group">
                            <label htmlFor="role">Role</label>

                            <select
                                required
                                id="role"
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
                    {formData.interviewType === "Resume" && (
                        <div className="form-group">
                            <label htmlFor="resume">Resume (PDF, up to 5 MB)</label>

                            <input
                                id="resume"
                                aria-describedby="resume-help"
                                required
                                type="file"
                                accept=".pdf,application/pdf"
                                disabled={loading}
                                onChange={(e) => {
                                    setError("");
                                    setFormData({ ...formData, resume: e.target.files[0] });
                                }}
                            />
                            <small id="resume-help">Choose a PDF with selectable text, up to 20,000 characters.</small>
                        </div>
                    )}

                    {/* Experience */}

                    <div className="form-group">
                        <label htmlFor="experience">Experience</label>

                        <select
                            required
                            id="experience"
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
                        <label htmlFor="difficulty">Difficulty</label>

                        <select
                            required
                            id="difficulty"
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

                    {error && <p className="error" role="alert">{error}</p>}
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