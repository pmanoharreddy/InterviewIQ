import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="masthead">
      <nav className="masthead-inner wrap" aria-label="Main navigation">
        <Link to="/" className="wordmark">InterviewIQ</Link>
        <div className="masthead-links">
          <a href="#features">Practice formats</a>
          <a href="#how-it-works">How it works</a>
        </div>
        <Link className="sign-in-link" to="/login">Sign in <span aria-hidden="true">↗</span></Link>
      </nav>
    </header>
  );
}
