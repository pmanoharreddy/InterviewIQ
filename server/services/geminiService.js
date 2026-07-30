const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Model constant
const MODEL = "gemini-flash-latest";

// Helper to safely parse Gemini JSON responses
function parseGeminiJSON(text) {
    return JSON.parse(
        text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()
    );
}

async function generateInterviewQuestion(
    role,
    experience,
    difficulty
) {
    const prompt = `
You are an expert software engineering interviewer.

Generate ONLY ONE interview question.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Rules:
- Ask only one question.
- Do not include the answer.
- Do not include explanations.
- Return only the question.
`;

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
    });

    return response.text;
}

async function generateFollowUpQuestion(
    role,
    experience,
    difficulty,
    currentQuestion,
    answer,
    conversation = [],
    questionNumber
) {
    const conversationHistory = conversation
        .map(
            (item) => `
Interviewer: ${item.question}
Candidate: ${item.answer}
`
        )
        .join("\n");

    const prompt = `
You are conducting a realistic software engineering interview.

Candidate:
Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Current main question number: ${questionNumber}
Total main questions: 10

Previous conversation:
${conversationHistory || "No previous conversation."}

Current Question:
${currentQuestion}

Candidate Answer:
${answer}

Analyze the candidate's answer and decide what to do next.

You have THREE choices:

1. FOLLOW_UP

Use FOLLOW_UP when:
- The answer is incorrect.
- The answer is incomplete or unclear.
- You need to test deeper understanding.
- For DSA/coding, complexity has not been discussed when relevant.
- The candidate's approach can be optimized.
- An important edge case or implementation detail should be explored.

For DSA/coding:
- Explore the candidate's approach.
- Ask about time and space complexity when appropriate.
- Ask for optimization when appropriate.
- Ask about implementation or edge cases when useful.
- Do not ask something they already explained.

2. NEXT_QUESTION

Use NEXT_QUESTION when:
- The candidate has demonstrated sufficient understanding of the current topic.
- Important follow-ups have already been answered.
- Further questioning would become repetitive.

When choosing NEXT_QUESTION:
- Generate a new interview question.
- Keep it relevant to the candidate's role.
- Match the requested difficulty and experience.
- Avoid repeating topics already sufficiently covered.

3. END_INTERVIEW

Use END_INTERVIEW only when:
- The current main question number is 10.
- The candidate has sufficiently answered the final question,
  OR useful follow-ups for the final question have been completed.
- There is no meaningful reason to continue the final topic.

IMPORTANT INTERVIEW RULES:

- Ask only ONE question at a time.
- Do not provide the answer or solution.
- Do not include praise, feedback, explanations, or scoring.
- Do not ask something the candidate has already answered.
- Do not keep drilling into a topic unnecessarily.
- Follow-ups should feel natural, not like a fixed checklist.

QUESTION NUMBER RULES:

- If questionNumber is less than 10:
    You may return FOLLOW_UP or NEXT_QUESTION.
    NEVER return END_INTERVIEW.

- If questionNumber is 10:
    You may return FOLLOW_UP if another useful follow-up is needed.
    NEVER return NEXT_QUESTION.
    Once the final topic has been sufficiently explored,
    return END_INTERVIEW.

- NEVER generate an 11th main question.

Return ONLY valid JSON.

For a follow-up:

{
    "type": "FOLLOW_UP",
    "question": "Your follow-up question"
}

For a new main question:

{
    "type": "NEXT_QUESTION",
    "question": "Your new interview question"
}

When the interview is complete:

{
    "type": "END_INTERVIEW",
    "question": null
}
`;

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
    });

    return parseGeminiJSON(response.text);
}
async function generateInterviewEvaluation(conversation = []) {
    const conversationHistory = conversation
        .map(
            (item, index) => `
Question ${index + 1}:
${item.question}

Candidate Answer:
${item.answer}
`
        )
        .join("\n");

    const prompt = `
You are an expert Senior Software Engineering Interviewer.

Evaluate the candidate's interview performance based ONLY on the interview conversation below.

Interview Conversation:

${conversationHistory}

Evaluation Instructions:

Score the candidate fairly.

Consider:

- Technical knowledge
- Problem-solving ability
- Communication skills
- Confidence
- Completeness of answers
- Accuracy
- Ability to explain concepts
- Handling of edge cases
- Optimization discussions

Do NOT give perfect scores unless truly deserved.

Scoring Guide:

90-100 = Outstanding
80-89 = Very Good
70-79 = Good
60-69 = Average
Below 60 = Needs Improvement

Return ONLY valid JSON.

{
    "overallScore": 0,
    "technicalScore": 0,
    "problemSolvingScore": 0,
    "communicationScore": 0,
    "confidenceScore": 0,

    "strengths": [
        "",
        "",
        ""
    ],

    "improvements": [
        "",
        "",
        ""
    ],

    "feedback": ""
}

Rules:

- Scores must be integers.
- Keep strengths to exactly 3 items.
- Keep improvements to exactly 3 items.
- Feedback should be between 80 and 150 words.
- Return ONLY JSON.
`;

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
    });

    return parseGeminiJSON(response.text);
}

module.exports = {
    generateInterviewQuestion,
    generateFollowUpQuestion,
    generateInterviewEvaluation,
};