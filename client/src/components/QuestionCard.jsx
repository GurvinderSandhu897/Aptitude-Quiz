import { useState } from "react";

export default function QuestionCard({ question, canSkip, onAnswer, onSkip }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="card">
      {!canSkip && (
        <span className="badge">Skipped earlier: last chance to answer</span>
      )}

      <h2 className="question">{question.text}</h2>

      {question.imageUrl && (
        <img
          className="q-image"
          src={question.imageUrl}
          alt="Diagram for this question"
        />
      )}

      <div className="options" role="radiogroup">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={selected === i}
            className={"option" + (selected === i ? " selected" : "")}
            onClick={() => setSelected(i)}
          >
            <span className="letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn ghost"
          onClick={onSkip}
          disabled={!canSkip}
        >
          Skip
        </button>
        <button
          type="button"
          className="btn primary"
          onClick={() => onAnswer(selected)}
          disabled={selected === null}
        >
          Submit answer
        </button>
      </div>
    </div>
  );
}