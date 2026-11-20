import { Link } from "react-router-dom";
import QuestionDeck from "./QuestionDeck";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero wrap" id="home">
      <div>
        <h1>Before the<br /><em>interview.</em></h1>
        <p>Take a practice interview for the role you want. Work through the follow-ups, then see where your answers could be sharper.</p>
        <Link to="/signup" className="ink-link">Start practicing <span aria-hidden="true">→</span></Link>
      </div>
      <QuestionDeck />
    </section>
  );
}
