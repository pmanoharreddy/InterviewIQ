import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import hero from "../assets/hero.png";
import axios from "axios";
import Loader from "../components/Loader/Loader";

const API_URL = import.meta.env.VITE_API_URL;

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

        const { validationErrors, isValid } = validateForm();

        setErrors(validationErrors);

        if (!isValid) {
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                formData,
                {
                    withCredentials: true,
                }
            );

            console.log(response.data);

            setFormData(initialFormData);
            setErrors(initialErrors);

            navigate("/dashboard");

        } catch (err) {

            console.log(err.response?.data || err.message);

            alert(
                err.response?.data?.message ||
                "Something went wrong"
            );

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

            <Link to="/" className="auth-logo">
                InterviewIQ
            </Link>

            <div className="signup-container">

                <div className="signup-image">

                    <div className="image-content">

                        <h2>Welcome Back.</h2>

                        <p>
                            Continue your AI interview preparation and track your progress towards your dream job.
                        </p>

                        <img
                            src={hero}
                            alt="InterviewIQ"
                        />

                    </div>

                </div>

                <div className="signup-form">

                    <h1>Login</h1>

                    <p>
                        Sign in to continue your interview preparation journey.
                    </p>

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

                        <button
                            type="submit"
                            className="signup-btn"
                        >
                            Login
                        </button>

                    </form>

                    <p className="login-link">

                        Don't have an account?

                        <Link to="/signup">
                            Sign Up
                        </Link>

                    </p>

                </div>

            </div>

        </section>

    );
}

export default Login;