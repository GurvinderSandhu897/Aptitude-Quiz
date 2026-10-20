import express from "express";
import mongoose from "mongoose";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import { generateQuestions, shuffle } from "../utils/generators.js";

const router = express.Router();
const TOTAL_QUESTIONS = 10;
const WRONG_PENALTY = 0;        // points lost for a wrong answer
const UNANSWERED_PENALTY = 0;   // points lost for an unanswered question
const GENERATED_COUNT = 4;           // 4 generated + 6 from the bank
const DURATION_SEC = 10 * 60;
const GRACE_SEC = 15;   // allowance for network delay

// Shuffle options and keep track of where the correct one lands
function shuffleOptions(q) {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    text: q.text,
    imageUrl: q.imageUrl || null,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correctIndex),
  };
}

// GET /api/quiz/start?exclude=id1,id2   (recently seen bank questions)
router.get("/start", async (req, res) => {
  try {
    const exclude = (req.query.exclude || "")
      .split(",")
      .filter((id) => mongoose.isValidObjectId(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const bankNeeded = TOTAL_QUESTIONS - GENERATED_COUNT;

    let bank = await Question.aggregate([
      { $match: { _id: { $nin: exclude } } },
      { $sample: { size: bankNeeded } },
    ]);

    // pool too small after exclusions? top up without exclusions
    if (bank.length < bankNeeded) {
      const have = bank.map((q) => q._id);
      const extra = await Question.aggregate([
        { $match: { _id: { $nin: have } } },
        { $sample: { size: bankNeeded - bank.length } },
      ]);
      bank = [...bank, ...extra];
    }

    const generated = generateQuestions(TOTAL_QUESTIONS - bank.length);

    const items = shuffle([
      ...bank.map((q) => ({ ...shuffleOptions(q), bankId: q._id })),
      ...generated.map(shuffleOptions),
    ]);

    const attempt = await Attempt.create({ items });

    res.json({
      attemptId: attempt._id,
      durationSec: DURATION_SEC,
      // _id here is the attempt-item id; correctIndex is NOT sent
      questions: attempt.items.map(({ _id, text, imageUrl, options }) => ({
        _id, text, imageUrl, options,
      })),
      // lets the client remember what it has seen
      bankIds: bank.map((q) => q._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/submit", async (req, res) => {
  try {
    const { attemptId, answers = [] } = req.body;
    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    if (attempt.submitted)
      return res.status(400).json({ error: "Already submitted" });

    const elapsedSec = (Date.now() - attempt.startedAt.getTime()) / 1000;
    const late = elapsedSec > DURATION_SEC + GRACE_SEC;

    const answerMap = new Map(
      late ? [] : answers.map((a) => [a.questionId, a.selectedIndex])
    );

    let score = 0, correct = 0, incorrect = 0, unanswered = 0;
    const review = attempt.items.map((q) => {
      const selected = answerMap.get(String(q._id));
      const answered = Number.isInteger(selected);
      if (!answered) { score -= UNANSWERED_PENALTY; unanswered++; }
      else if (selected === q.correctIndex) { score += 1; correct++; }
      else { score -= WRONG_PENALTY; incorrect++; }
      return {
        questionId: q._id,
        text: q.text,
        imageUrl: q.imageUrl,
        options: q.options,
        selectedIndex: answered ? selected : null,
        correctIndex: q.correctIndex,
      };
    });

    attempt.submitted = true;
    attempt.score = score;
    await attempt.save();

    res.json({ score, correct, incorrect, unanswered, total: attempt.items.length,late, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;