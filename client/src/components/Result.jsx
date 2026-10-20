import { useState } from "react";
import Review from "./Review";

function getMessage(score, total) {
  const pct = score / total;
  if (pct >= 0.9) return "Outstanding! Your speed and accuracy are top-tier. You're ready for any aptitude round.";
  if (pct >= 0.7) return "Great work! You're solid on the fundamentals. A little more practice will make you unstoppable.";
  if (pct >= 0.4) return "Good effort! You're on the right track. Review the ones you missed and try again.";
  if (pct > 0) return "A good start! Every attempt builds speed and confidence. Keep practising and the score will climb.";
  return "Don't be discouraged. Aptitude skills improve fast with practice. Take a breath and give it another go!";
}

export default function Result({ result, onRetry }) {
  const [showReview, setShowReview] = useState(false);
  const { score, correct, incorrect, unanswered, total, late, review } = result;

  return (
    <>
      <div className="card center">
        <p className="label">Your score</p>
        <div className={"score" + (score < 0 ? " negative" : "")}>
          {score}
          <span className="out-of"> / {total}</span>
        </div>

        <p className="encourage">{getMessage(score, total)}</p>

        <div className="stats">
          <div><strong>{correct}</strong><span>Correct (+1)</span></div>
          <div><strong>{incorrect}</strong><span>Wrong (0)</span></div>
          <div><strong>{unanswered}</strong><span>Unanswered (0)</span></div>
        </div>

        {late ? (
          <p className="note">
            This attempt reached the server after the time limit, so no answers were counted.
          </p>
        ) : (
          unanswered > 0 && (
            <p className="note">
              Time ran out before {unanswered} question{unanswered > 1 ? "s were" : " was"} answered.
            </p>
          )
        )}

        <div className="actions center">
          <button type="button" className="btn ghost" onClick={() => setShowReview((v) => !v)}>
            {showReview ? "Hide review" : "Review answers"}
          </button>
          <button type="button" className="btn primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      </div>

      {showReview && <Review review={review} />}
    </>
  );
}