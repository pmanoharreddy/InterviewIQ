import { useState } from "react";
import "./Interview.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Interview() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: "",
        experience: "",
        difficulty: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.role ||
            !formData.experience ||
            !formData.difficulty
        ) {
            alert("Please fill all fields");
            return;
        }

        try {

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
                    role: formData.role,
                    experience: formData.experience,
                    difficulty: formData.difficulty,
                },
            });

        } catch (err) {

            console.log(err.response?.data || err.message);

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

                    <div className="form-group">

                        <label>Role</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="">Select Role</option>

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

                    <div className="form-group">

                        <label>Experience</label>

                        <select
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                        >
                            <option value="">Select Experience</option>

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

                    <div className="form-group">

                        <label>Difficulty</label>

                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            <option value="">Select Difficulty</option>

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
                    >
                        Start Interview
                    </button>

                </form>

            </div>

        </div>

    );

}

export default Interview;