import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  text: String,
  imageUrl: { type: String, default: null },
  options: [String],          // already shuffled
  correctIndex: Number,       // index in the shuffled options
});

const attemptSchema = new mongoose.Schema({
  items: [itemSchema],
  startedAt: { type: Date, default: Date.now },
  submitted: { type: Boolean, default: false },
  score: Number,
});

export default mongoose.model("Attempt", attemptSchema);