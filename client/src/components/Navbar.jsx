import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-container">

                <div className="logo">
                    <Link to="/">InterviewIQ</Link>
                </div>

                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                </ul>

                <div className="auth-buttons">
                    <Link to="/login" className="login-btn">Login</Link>
                    <Link to="/signup" className="signup-btn">Sign Up</Link>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;