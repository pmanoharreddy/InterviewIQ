import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import QuestionDeck from "../components/QuestionDeck";
import axios from "axios";
import Loader from "../components/Loader/Loader";

import { API_URL } from "../config";

const initialErrors = {
    email: "",
    password: ""
};

const initialFormData = {
    email: "",
    password: ""
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState(initialErrors);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateForm = () => {

        const validationErrors = { ...initialErrors };
        let isValid = true;

        const email = formData.email.trim();
        const password = formData.password.trim();

        if (email === "") {
            validationErrors.email = "Email is required.";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            validationErrors.email = "Enter a valid email.";
            isValid = false;
        }

        if (password === "") {
            validationErrors.password = "Password is required.";
            isValid = false;
        }

        return {
            validationErrors,
            isValid,
        };
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;
        const { validationErrors, isValid } = validateForm();

        setErrors(validationErrors);

        if (!isValid) {
            return;
        }

        try {

            setLoading(true);

            await axios.post(
                `${API_URL}/api/auth/login`,
                formData,
                {
                    withCredentials: true,
                }
            );

            setFormData(initialFormData);
            setErrors(initialErrors);

            navigate("/dashboard");

        } catch (err) {

            setErrors(prev => ({
                ...prev,
                form: err.response?.data?.message || "Could not reach InterviewIQ. Please try again.",
            }));

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <Loader message="Authenticating..." />
        );
    }

    return (

        <section className="signup">

            <Link to="/" className="auth-logo wordmark">
                InterviewIQ
            </Link>

            <div className="signup-container">

                <div className="signup-form">
                    <h1>Sign in</h1>
                    <p>Open your practice history or start a new interview.</p>

                    <form onSubmit={handleSubmit}>

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {
                            errors.email &&
                            <p className="error">
                                {errors.email}
                            </p>
                        }

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-box">

                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword
                                        ? "Hide Password"
                                        : "Show Password"
                                }
                            >
                                {
                                    showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                }
                            </button>

                        </div>

                        {
                            errors.password &&
                            <p className="error">
                                {errors.password}
                            </p>
                        }

                        {errors.form && <p className="error" role="alert">{errors.form}</p>}
                        <button
                            disabled={loading}
                            type="submit"
                            className="signup-btn"
                        >
                            Sign in
                        </button>

                    </form>

                    <p className="login-link">

                        Don't have an account?

                        <Link to="/signup">
                            Create an account
                        </Link>

                    </p>

                </div>
                <aside className="auth-samples"><QuestionDeck /></aside>
            </div>
        </section>

    );
}

export default Login;