import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import quizRoutes from "./routes/quiz.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("public/images"));
app.use("/api/quiz", quizRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((e) => console.error(e));