import "./Features.css";

const formats = [
  ["Technical", "Work through decisions you’d face as a frontend, backend, full-stack, or Java developer."],
  ["Algorithms", "Explain your approach to a data structures problem and weigh the trade-offs."],
  ["Behavioral", "Practice telling a specific story about teamwork, conflict, or a difficult decision."],
  ["Resume", "Bring a PDF of your resume and field questions about the work you’ve actually done."],
];

export default function Features() {
  return (
    <section className="formats wrap" id="features" aria-labelledby="formats-heading">
      <h2 id="formats-heading">Practice formats</h2>
      <dl>{formats.map(([name, description]) => (
        <div key={name}><dt>{name}</dt><dd>{description}</dd></div>
      ))}</dl>
    </section>
  );
}
