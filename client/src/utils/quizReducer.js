export const initialState = {
  phase: "idle",        // idle | loading | running | submitting | finished | error
  attemptId: null,
  durationSec: 600,
  deadline: null,
  questions: {},        // id -> question object
  queue: [],            // ids in the order they will be shown
  skipped: [],          // ids already skipped once
  answers: {},          // id -> selected option index
  result: null,
  error: null,
};

export function quizReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...initialState, phase: "loading" };

    case "STARTED": {
      const { attemptId, durationSec, questions } = action.payload;
      return {
        ...initialState,
        phase: "running",
        attemptId,
        durationSec,
        deadline: action.deadline,  
        questions: Object.fromEntries(questions.map((q) => [q._id, q])),
        queue: questions.map((q) => q._id),
      };
    }

    case "ANSWER": {
      if (state.phase !== "running" || state.queue.length === 0) return state;
      const [current, ...rest] = state.queue;
      return {
        ...state,
        answers: { ...state.answers, [current]: action.selectedIndex },
        queue: rest,
      };
    }

    case "SKIP": {
      if (state.phase !== "running" || state.queue.length === 0) return state;
      const [current, ...rest] = state.queue;
      if (state.skipped.includes(current)) return state; // one skip per question
      return {
        ...state,
        queue: [...rest, current],           // goes to the back; skips stack
        skipped: [...state.skipped, current],
      };
    }

    case "SUBMITTING":
      return { ...state, phase: "submitting" };

    case "FINISHED":
      return { ...state, phase: "finished", result: action.result };

    case "ERROR":
      return { ...state, phase: "error", error: action.message };

    default:
      return state;
  }
}