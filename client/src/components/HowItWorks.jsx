import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <section className="session-guide" id="how-it-works" aria-labelledby="guide-heading">
      <div className="wrap">
        <h2 id="guide-heading">Inside a session</h2>
        <ol>
          <li><strong>Set the brief</strong><p>Sign in, pick a format, and choose your experience level and difficulty.</p></li>
          <li><strong>Work through ten questions</strong><p>Type your answer. The AI interviewer can ask a follow-up before moving on.</p></li>
          <li><strong>Read your notes</strong><p>Review your scores and feedback. Your history keeps the questions and your answers together.</p></li>
        </ol>
      </div>
    </section>
  );
}
