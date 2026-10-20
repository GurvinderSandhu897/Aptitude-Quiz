# Aptitude Quiz Platform

**Live demo:** https://aptitude-quiz-psi.vercel.app

> The backend runs on a free Render server, so the first load after a quiet period can take up to a minute while it wakes up.

A timed aptitude test built with the MERN stack. Questions are different on every attempt.

## Features
- 10 multiple-choice questions with a 10-minute countdown timer
- Scoring: +1 for a correct answer, 0 for wrong or unanswered questions
- Skip option with no penalty: skipped questions return after the last question (skips stack)
- Random questions each run: a mix of questions from a database and procedurally generated ones (fresh numbers every time), with shuffled options
- Image-based questions
- Server-side scoring: correct answers are never sent to the browser
- Server-side time-limit check
- Result screen with score breakdown and an encouraging message
- Answer review screen showing your answer vs the correct one

## Tech stack
React (Vite), Node.js, Express, MongoDB (Mongoose)

## Getting started
## Deployment
- **Frontend:** Vercel (root directory `client`). `client/vercel.json` forwards `/api` and `/images` requests to the backend.
- **Backend:** Render web service (root directory `server`, start command `npm start`)
- **Database:** MongoDB Atlas (set as the `MONGO_URI` environment variable on Render)

### Prerequisites
Node.js 18+ and MongoDB (local or Atlas)

### Server
```bash
cd server
npm install
cp .env.example .env      # then edit if needed
npm run seed              # loads the sample questions
npm run dev
```

### Optional: import more questions (AQuA-RAT)
```bash
curl -O https://raw.githubusercontent.com/deepmind/AQuA/master/dev.json
node importAqua.js dev.json 300
```
Run the seed before the import, because the seed clears the collection first.

### Client
```bash
cd client
npm install
npm run dev
```
Open http://localhost:5173

## Question sources
- Original questions and generated questions written for this project
- [AQuA-RAT](https://github.com/google-deepmind/AQuA) by DeepMind, Apache 2.0 licence

## Project structure
```
server/   Express API, Mongoose models, question generators, seed/import scripts
client/   React app (quiz state machine, timer, question UI, result screen)
```
