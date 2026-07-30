import "./Features.css";
import { FaFileAlt, FaRobot, FaBriefcase, FaChartLine, FaHistory, FaShieldAlt } from "react-icons/fa";

function Features(){
    return(
        <section className="features" id="features">
            <h2>Why Choose InterviewIQ?</h2>

            <p className="features-text">Everything you need to prepare smarter, improve faster and crack your next interview with confidence.</p>

            <div className="features-container">

                <div className="feature-card">
                    <FaFileAlt className="feature-icon"/>
                    <h3>Resume Based Interviews</h3>
                    <p>Upload your resume and receive personalized interview questions based on your skills and experience.</p>
                </div>

                <div className="feature-card">
                    <FaRobot className="feature-icon"/>
                    <h3>AI Powered Feedback</h3>
                    <p>Receive instant AI feedback with suggestions to improve your communication and technical answers.</p>
                </div>

                <div className="feature-card">
                    <FaBriefcase className="feature-icon"/>
                    <h3>Role Specific Practice</h3>
                    <p>Practice interviews for Frontend, Backend, Full Stack, Data Science and many other roles.</p>
                </div>

                <div className="feature-card">
                    <FaChartLine className="feature-icon"/>
                    <h3>Performance Analytics</h3>
                    <p>Analyze your strengths, weaknesses and overall interview performance through detailed reports.</p>
                </div>

                <div className="feature-card">
                    <FaHistory className="feature-icon"/>
                    <h3>Interview History</h3>
                    <p>Access all your previous interviews, scores and feedback anytime from your dashboard.</p>
                </div>

                <div className="feature-card">
                    <FaShieldAlt className="feature-icon"/>
                    <h3>Secure Authentication</h3>
                    <p>Your account, interview history and personal data remain safe with secure authentication.</p>
                </div>

            </div>
        </section>
    );
}

export default Features;