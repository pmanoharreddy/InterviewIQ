# InterviewIQ - AI-Powered Mock Interview Platform

InterviewIQ is a full-stack web application that helps students and job seekers practice interviews through AI-powered mock interview sessions.

Users can practice Technical, DSA, HR, and Resume-based interviews, receive AI-generated questions and feedback, track their performance, and review previous interview attempts.

---

## Live Demo

**Frontend:**  
https://interviewiq-mu.vercel.app/

**Backend API:**  
https://interviewiq-nzf2.onrender.com/

**GitHub:**  
https://github.com/pmanoharreddy/InterviewIQ

---

## Overview

InterviewIQ is designed to simulate a real interview environment without requiring another person to conduct the interview.

The platform allows users to:

- Practice different types of interviews
- Generate AI-powered interview questions
- Upload a resume for personalized interview questions
- Answer questions one by one
- Receive AI-generated performance evaluations
- View detailed scores and feedback
- Track interview performance through a dashboard
- Review previous interviews and conversations

---

## Problem Statement

Preparing for technical interviews requires consistent practice and useful feedback. Students may not always have access to someone who can conduct mock interviews and evaluate their answers.

InterviewIQ addresses this problem by providing an AI-powered interviewer that can generate relevant questions, evaluate responses, and provide personalized feedback.

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- HTTP-only cookies
- Protected routes
- Logout

### Multiple Interview Types

Users can practice different types of interviews:

- Technical interviews
- DSA interviews
- HR interviews
- Resume-based interviews

### AI-Powered Interviews

- AI-generated interview questions
- Questions based on selected interview parameters
- Interactive question-by-question interview flow
- Answer submission
- AI-powered response evaluation

### Resume-Based Interviews

Users can upload their resume and generate an interview based on the information in their resume.

The platform uses the uploaded resume to create relevant questions and simulate a resume-focused interview.

### AI Feedback

After completing an interview, InterviewIQ provides:

- Overall score
- Technical score
- Problem-solving score
- Communication score
- Confidence score
- Strengths
- Areas for improvement
- Personalized AI feedback

### Dashboard

The dashboard provides an overview of interview performance.

It includes:

- Total interviews
- Average score
- Highest score
- Latest score
- Recent interviews
- Start interview option
- Interview history

### Interview History

Users can:

- View previous interviews
- View interview scores
- View detailed interview results
- Review AI feedback
- Review previous questions and answers

---

## How It Works

```text
User
  |
  v
Create Account / Login
  |
  v
Choose Interview Type
  |
  +---- Technical
  |
  +---- DSA
  |
  +---- HR
  |
  +---- Resume-Based
            |
            v
      Generate Questions
            |
            v
       Answer Questions
            |
            v
        AI Evaluation
            |
            v
       Generate Feedback
            |
            v
        Calculate Scores
            |
            v
       Store in MongoDB
            |
            v
      Dashboard / History
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/pmanoharreddy/InterviewIQ.git
```

From the repository root, start the frontend

```bash
cd client
npm install
npm run dev
```

In a second terminal at the repository root, configure the server environment below and start the backend

```bash
cd server
npm install
npm start
```

---

## Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGO_URL=your_mongodb_uri

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

---

The development client uses `http://localhost:5000` by default. For a separately hosted API, set `VITE_API_URL` in the client build environment to the backend origin and set `CLIENT_URL` on the server to the frontend origin. Use `NODE_ENV=production` for HTTPS deployments.

## Project checks

From the repository root, run the client lint check, build the production client, and test the interview API with simulated AI and database responses.

```bash
npm --prefix client run lint
npm --prefix client run build
npm --prefix server test
```
