import { useEffect } from "react";
import useQuiz from "./hooks/useQuiz";
import Timer from "./components/Timer";
import QuestionCard from "./components/QuestionCard";
import Result from "./components/Result";
import "./App.css";

function Shell({ children }) {
  return <main className="app">{children}</main>;
}

function StartScreen({ onStart }) {
  return (
    <div className="card center">
      <h1>Aptitude Test</h1>
      <ul className="rules">
        <li>10 multiple-choice questions, 10 minutes in total</li>
        <li>Correct answer: +1 &nbsp;·&nbsp; Wrong answer: −1</li>
        <li>Skip a question for no penalty. It comes back after the last one, once.</li>
        <li>When time runs out, every unanswered question costs −1</li>
      </ul>
      <button type="button" className="btn primary" onClick={onStart}>
        Start test
      </button>
    </div>
  );
}

export default function App() {
  const { state, current, canSkip, total, answeredCount, start, finish, answer, skip } =
    useQuiz();
  const { phase } = state;

    // Ask for confirmation if the tab is closed or refreshed during the test
  useEffect(() => {
    if (phase !== "running") return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  if (phase === "idle")
    return <Shell><StartScreen onStart={start} /></Shell>;

  if (phase === "loading")
    return <Shell><p className="status">Loading your questions…</p></Shell>;

  if (phase === "error")
    return (
      <Shell>
        <div className="card center">
          <p>Something went wrong: {state.error}</p>
          <button type="button" className="btn primary" onClick={start}>Try again</button>
        </div>
      </Shell>
    );

  // The queue is empty for one render after the last answer, before submitting starts
  if (phase === "submitting" || (phase === "running" && !current))
    return <Shell><p className="status">Calculating your score…</p></Shell>;

  if (phase === "finished")
    return <Shell><Result result={state.result} onRetry={start} /></Shell>;

  return (
    <Shell>
      <header className="topbar">
        <div className="progress-text">
          Answered {answeredCount} / {total}
        </div>
        <Timer
          deadline={state.deadline}
          durationSec={state.durationSec}
          onExpire={finish}
        />
      </header>

      <div className="progress">
        <div
          className="progress-fill"
          style={{ width: `${(answeredCount / total) * 100}%` }}
        />
      </div>

      <QuestionCard
        key={current._id}
        question={current}
        canSkip={canSkip}
        onAnswer={answer}
        onSkip={skip}
      />
    </Shell>
  );
}