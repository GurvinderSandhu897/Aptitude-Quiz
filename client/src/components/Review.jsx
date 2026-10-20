const LABELS = {
  correct: "Correct +1",
  wrong: "Wrong 0",
  unanswered: "Unanswered 0",
};

export default function Review({ review }) {
  return (
    <div className="review">
      <h2>Review</h2>

      {review.map((q, n) => {
        const status =
          q.selectedIndex === null
            ? "unanswered"
            : q.selectedIndex === q.correctIndex
            ? "correct"
            : "wrong";

        return (
          <div className="card" key={q.questionId}>
            <div className="review-head">
              <span>Question {n + 1}</span>
              <span className={`tag ${status}`}>{LABELS[status]}</span>
            </div>

            <p className="question">{q.text}</p>

            {q.imageUrl && (
              <img className="q-image" src={q.imageUrl} alt="Diagram for this question" />
            )}

            <ul className="review-options">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctIndex;
                const isChosen = i === q.selectedIndex;
                const cls = isCorrect ? "is-correct" : isChosen ? "is-wrong" : "";
                return (
                  <li key={i} className={cls}>
                    <span className="letter">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                    {isCorrect && <em>Correct answer</em>}
                    {isChosen && !isCorrect && <em>Your answer</em>}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}