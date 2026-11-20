import { useState } from "react";
import "./QuestionDeck.css";

const questions = [
  ["Behavioral", "Tell me about a time you changed your mind at work."],
  ["Technical", "A page feels slow, but the API is fast. Where would you look first?"],
  ["Algorithms", "How would you find the first repeated word in a long document?"],
  ["Resume", "Pick a project on your resume. Which decision would you make differently today?"],
];

export default function QuestionDeck() {
  const [index, setIndex] = useState(0);
  const [format, question] = questions[index];
  const move = offset => setIndex(current => (current + offset + questions.length) % questions.length);

  return (
    <section className="question-file" aria-label="Sample interview questions">
      <div className="file-tab">Question file</div>
      <div className="file-body">
        <div className="file-card" aria-live="polite" aria-atomic="true">
          <div className="file-meta"><span>{format}</span><span>0{index + 1} / 0{questions.length}</span></div>
          <p className="file-question">{question}</p>
          <div className="file-ruling" aria-hidden="true" />
        </div>
        <div className="file-controls">
          <span>Sample questions</span>
          <div>
            <button type="button" aria-label="Previous sample question" onClick={() => move(-1)}>←</button>
            <button type="button" aria-label="Next sample question" onClick={() => move(1)}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
