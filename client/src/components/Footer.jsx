import "./Footer.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer(){
    return(
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-logo">

                    <h2>InterviewIQ</h2>

                    <p>Practice smarter with AI-powered mock interviews and detailed feedback.</p>

                </div>

                <div className="footer-links">

                    <h3>Quick Links</h3>

                    <a href="#home">Home</a>
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>

                </div>

                <div className="footer-contact">

                    <h3>Contact</h3>

                    <a href="mailto:contact@interviewiq.com">
                        <FaEnvelope/> contact@interviewiq.com
                    </a>

                    <a href="#">
                        <FaGithub/> GitHub
                    </a>

                    <a href="#">
                        <FaLinkedin/> LinkedIn
                    </a>

                </div>

            </div>

            <div className="footer-bottom">

                <p>© 2026 InterviewIQ. Built with React, Express, MongoDB and Gemini AI.</p>

            </div>

        </footer>
    );
}

export default Footer;