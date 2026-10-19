import { useReducer, useCallback, useEffect, useRef } from "react";
import { quizReducer, initialState } from "../utils/quizReducer";
import { startQuiz, submitQuiz } from "../utils/api";
import { getRecentIds, saveRecentIds } from "../utils/recent";

export default function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const stateRef = useRef(state);
  const submittedRef = useRef(false);     // prevents double submission
  useEffect(() => {
     stateRef.current = state;
   }, [state]);

  const start = useCallback(async () => {
    submittedRef.current = false;
    dispatch({ type: "LOADING" });
    try {
      const data = await startQuiz(getRecentIds());
      saveRecentIds(data.bankIds);
      dispatch({ type: "STARTED", payload: data ,deadline: Date.now() + data.durationSec * 1000,});
    } catch (e) {
      dispatch({ type: "ERROR", message: e.message });
    }
  }, []);

  // Called when the queue empties, and later by the timer on timeout
  const finish = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const { attemptId, answers } = stateRef.current;
    dispatch({ type: "SUBMITTING" });
    try {
      const payload = Object.entries(answers).map(([questionId, selectedIndex]) => ({
        questionId,
        selectedIndex,
      }));
      const result = await submitQuiz(attemptId, payload);
      dispatch({ type: "FINISHED", result });
    } catch (e) {
      submittedRef.current = false;
      dispatch({ type: "ERROR", message: e.message });
    }
  }, []);

  // Auto-submit when every question has been answered
  useEffect(() => {
    if (state.phase === "running" && state.queue.length === 0) finish();
  }, [state.phase, state.queue.length, finish]);

  const currentId = state.queue[0];
  const current = currentId ? state.questions[currentId] : null;

  return {
    state,
    current,
    canSkip: !!current && !state.skipped.includes(currentId),
    total: Object.keys(state.questions).length,
    answeredCount: Object.keys(state.answers).length,
    start,
    finish,
    answer: (selectedIndex) => dispatch({ type: "ANSWER", selectedIndex }),
    skip: () => dispatch({ type: "SKIP" }),
  };
}