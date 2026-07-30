# InterviewIQ - AI Powered Mock Interview Platform

InterviewIQ is a full-stack web application that helps users prepare for technical interviews through AI-powered mock interview sessions.

Users can create a customized interview, answer AI-generated questions, receive personalized feedback, and review their previous interview attempts. The platform aims to simulate a real interview experience while helping users identify their strengths and areas for improvement.

---

## Live Demo

Frontend: [https://your-vercel-link.vercel.app](https://interviewiq-mu.vercel.app/)

Backend API: [https://your-render-link.onrender.com](https://interviewiq-nzf2.onrender.com)

---

## Problem Statement

Preparing for technical interviews usually requires another person to ask questions and provide feedback. Many students struggle to find consistent practice opportunities.

InterviewIQ solves this by providing an AI interviewer that can:

- Generate interview questions
- Conduct mock interviews
- Evaluate answers
- Store interview history
- Help users improve over time

---

## Features

### Authentication

- User Registration
- User Login
- Secure JWT Authentication
- HTTP-only Cookies
- Protected Routes
- Logout

### AI Interview

- Create a new interview
- AI-generated interview questions using Google Gemini API
- Answer questions one by one
- Submit interview

### AI Feedback

- AI evaluates responses
- Displays strengths and areas for improvement
- Generates interview feedback

### Dashboard

- Start new interviews
- Access interview history
- View completed interviews

### Interview History

- Stores all previous interviews
- View interview details
- Review AI feedback

---

## How It Works

1. User creates an account.
2. User logs in securely.
3. User starts a new interview.
4. Google Gemini generates interview questions.
5. User answers each question.
6. AI evaluates the responses.
7. Interview results are stored in MongoDB.
8. Users can revisit previous interviews anytime.

---

## Tech Stack

### Frontend

- React.js
- React Router
- HTML5
- CSS3
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- HTTP-only Cookies

### Database

- MongoDB
- Mongoose

### AI Integration

- Google Gemini API

### Deployment

- Vercel
- Render
- MongoDB Atlas

---

## Project Structure

```
InterviewIQ
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── server.js
│
└── README.md
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/InterviewIQ.git
```

Install frontend

```bash
cd client
npm install
npm run dev
```

Install backend

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

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

---

## Future Improvements

- Voice-based mock interviews
- Resume-based interview generation
- Coding interview mode
- Company-specific interview sets
- Performance analytics dashboard

---

## Author

**P Manohar Reddy**

GitHub: (https://github.com/pmanoharreddy)

LinkedIn: (https://www.linkedin.com/in/manoharreddy1/)
