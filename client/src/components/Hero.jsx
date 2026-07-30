import "./Hero.css";
import { Link } from "react-router-dom";
import hero from "../assets/hero.png";

function Hero(){
    return(
        <section className="hero" id="home">
            <div className="hero-content">
                <h1>Ace Your Next <span>Interview</span> with AI</h1>

                <p>Practice resume-based and role-specific interviews with AI-powered feedback, performance analysis and personalized suggestions to improve your interview skills.</p>

                <div className="hero-buttons">
                    <Link to="/signup" className="get-started">Get Started</Link>

                    <a href="#features" className="learn-more">Learn More</a>
                </div>
            </div>

            <div className="hero-image">
                <img src={hero}/>
            </div>
        </section>
    );
}

export default Hero;