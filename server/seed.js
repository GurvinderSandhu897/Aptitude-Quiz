import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./models/Question.js";

dotenv.config();

const q = (text, options, correctIndex, category, imageUrl = null) => ({
  text, options, correctIndex, category, imageUrl, source: "Original",
});

const data = [
  q("What is 15% of 240?", ["24", "30", "36", "42"], 2, "Percentages"),
  q("A train 150 m long passes a pole in 10 s. Its speed in km/h is?", ["45", "54", "60", "72"], 1, "Speed"),
  q("Find the next number: 2, 6, 12, 20, 30, ?", ["40", "42", "44", "48"], 1, "Series"),
  q("If A:B = 2:3 and B:C = 4:5, then A:C = ?", ["8:15", "2:5", "6:10", "4:9"], 0, "Ratio"),
  q("The average of 5 numbers is 20. If one number is removed, the average becomes 18. The removed number is?", ["26", "28", "30", "32"], 1, "Averages"),
  q("A can finish a job in 12 days, B in 18 days. Together they take?", ["6.2 days", "7.2 days", "7.5 days", "8 days"], 1, "Time & Work"),
  q("Simple interest on ₹5000 at 8% per annum for 3 years is?", ["₹1000", "₹1200", "₹1400", "₹1500"], 1, "Interest"),
  q("Which word does NOT belong: Apple, Mango, Potato, Banana?", ["Apple", "Mango", "Potato", "Banana"], 2, "Odd one out"),
  q("A shopkeeper sells an item at 20% profit. If cost price is ₹250, selling price is?", ["₹280", "₹300", "₹320", "₹350"], 1, "Profit & Loss"),
  q("If COAT is coded as DPBU, how is MILK coded?", ["NJML", "NJLM", "MJLN", "NKML"], 0, "Coding"),
  q("Look at the image. Which number completes the pattern?", ["12", "14", "16", "18"], 2, "Pattern", "/images/series1.svg"),
  q("Look at the image. How many triangles are visible?", ["6", "8", "9", "10"], 1, "Figures", "/images/triangles1.svg"),
];

await mongoose.connect(process.env.MONGO_URI);
await Question.deleteMany({});
await Question.insertMany(data);
console.log(`Seeded ${data.length} questions`);
await mongoose.disconnect();