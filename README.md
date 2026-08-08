# InterviewIQ - AI-Powered Mock Interview Platform

InterviewIQ is a full-stack web application that helps students and job seekers practice technical interviews through AI-powered mock interview sessions.

Users can create different types of interviews, including technical, DSA, HR, and resume-based interviews. The platform generates questions using Google Gemini, evaluates responses, provides personalized feedback, and stores interview results for future review.

---

## Live Demo

**Frontend:**  
[https://your-vercel-link.vercel.app](https://interviewiq-mu.vercel.app/)

**Backend API:**  
[https://your-render-link.onrender.com](https://interviewiq-nzf2.onrender.com)

---

## Overview

InterviewIQ is designed to simulate an interview environment without requiring another person to conduct the interview.

The platform allows users to:

- Practice different types of interviews
- Upload their resume for personalized interview questions
- Answer questions in a simulated interview
- Receive AI-generated performance evaluations
- Track scores and performance
- Review previous interviews and detailed feedback

---

## Problem Statement

Preparing for technical interviews often requires consistent practice and feedback. Students may not always have access to someone who can conduct mock interviews and evaluate their responses.

InterviewIQ addresses this problem by providing an AI-powered interviewer that can generate questions, evaluate answers, and provide personalized feedback.

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

The system can use the uploaded resume to create relevant questions and simulate a resume-focused interview.

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

The dashboard provides an overview of the user's interview performance.

It includes:

- Total interviews
- Average score
- Highest score
- Latest score
- Recent interviews
- Quick access to start a new interview
- Interview history

### Interview History

Users can:

- View previous interviews
- View interview scores
- View interview details
- Review AI feedback
- Review previous questions and answers

---

## How It Works

```text
User
  │
  ▼
Create Account / Login
  │
  ▼
Choose Interview Type
  │
  ├── Technical
  ├── DSA
  ├── HR
  └── Resume-Based
          │
          ▼
    Generate Questions
          │
          ▼
     Answer Questions
          │
          ▼
       AI Evaluation
          │
          ▼
    Generate Feedback
          │
          ▼
     Calculate Scores
          │
          ▼
     Store in MongoDB
          │
          ▼
 Dashboard / History
