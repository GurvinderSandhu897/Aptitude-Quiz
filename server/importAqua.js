import fs from "fs";
import readline from "readline";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const file = process.argv[2] || "dev.json";
const limit = Number(process.argv[3]) || 300;

await mongoose.connect(process.env.MONGO_URI);

const rl = readline.createInterface({ input: fs.createReadStream(file) });
const docs = [];

for await (const line of rl) {
  if (!line.trim() || docs.length >= limit) continue;
  const r = JSON.parse(line);
  const options = r.options.map((o) => o.replace(/^[A-E]\)\s*/, ""));
  const correctIndex = "ABCDE".indexOf(r.correct);
  if (correctIndex < 0 || options.length < 2) continue;
  docs.push({
    text: r.question,
    options,
    correctIndex,
    category: "AQuA-RAT",
    source: "AQuA-RAT (DeepMind)",
  });
}

await Question.insertMany(docs);
console.log(`Imported ${docs.length} questions from ${file}`);
await mongoose.disconnect();