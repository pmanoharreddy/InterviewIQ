import "./HowItWorks.css";
import { FaUserPlus, FaUpload, FaComments, FaChartBar } from "react-icons/fa";

function HowItWorks(){
    return(
        <section className="how-it-works" id="how-it-works">

            <h2>How It Works</h2>

            <p className="how-text">Prepare for your dream job in four simple steps.</p>

            <div className="steps">

                <div className="step">
                    <div className="step-icon">
                        <FaUserPlus/>
                    </div>

                    <h3>Create Account</h3>

                    <p>Sign up and access your personalized interview dashboard.</p>
                </div>

                <div className="step">
                    <div className="step-icon">
                        <FaUpload/>
                    </div>

                    <h3>Upload Resume</h3>

                    <p>Upload your resume or choose your preferred job role.</p>
                </div>

                <div className="step">
                    <div className="step-icon">
                        <FaComments/>
                    </div>

                    <h3>Start Interview</h3>

                    <p>Answer AI-generated interview questions in real time.</p>
                </div>

                <div className="step">
                    <div className="step-icon">
                        <FaChartBar/>
                    </div>

                    <h3>Get Feedback</h3>

                    <p>Receive detailed AI feedback with scores and improvement tips.</p>
                </div>

            </div>

        </section>
    );
}

export default HowItWorks;