import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String, default: null },
  options: {
    type: [String],
    validate: (v) => v.length >= 2 && v.length <= 6,
  },
  correctIndex: { type: Number, required: true },
  category: String,
  source: { type: String, default: "Original" },
});

export default mongoose.model("Question", questionSchema);