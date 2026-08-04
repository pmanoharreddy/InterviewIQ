const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Model constant
const MODEL = "gemini-flash-latest";

// Helper to safely parse Gemini JSON responses
function parseGeminiJSON(text) {
    try {
        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (err) {

        // Extract JSON if Gemini adds extra text
        const match = text.match(/\{[\s\S]*\}/);

        if (match) {
            return JSON.parse(match[0]);
        }

        console.error("Gemini Response:\n", text);
        throw new Error("Failed to parse Gemini JSON.");
    }
}

async function generateGeminiResponse(
    prompt,
    expectJSON = false,
    temperature = 0.7
) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {

            const response = await ai.models.generateContent({
                model: MODEL,
                contents: prompt,
                config: {
                    temperature,
                    maxOutputTokens: 1000,
                },
            });

            const text = response.text.trim();

            // Debugging
            console.log("\n========== GEMINI RESPONSE ==========");
            console.log(text);
            console.log("=====================================\n");

            if (expectJSON) {
                return parseGeminiJSON(text);
            }

            return text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .replace(/^#+\s*/gm, "")
                .trim();

        } catch (err) {

            console.error(`Gemini attempt ${attempt} failed.`);

            if (attempt === 3) {
                throw err;
            }
        }
    }
}

async function generateInterviewQuestion(
    interviewType,
    role,
    experience,
    difficulty
) {
    let prompt = "";

if (interviewType === "Technical") {

    prompt = `
You are an expert software engineering interviewer.

Generate ONLY ONE interview question.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Rules:

- Ask ONE technical interview question.
- Questions should be related to:
  - Operating Systems
  - DBMS
  - OOP
  - Computer Networks
  - Software Engineering
  - Role-specific technologies
- Do NOT ask DSA or coding questions.
- Do NOT include the answer.
- Return only the question.
`;

}

else if (interviewType === "DSA") {

    prompt = `
You are an experienced FAANG software engineer conducting a live coding interview.

Generate EXACTLY ONE complete coding interview problem.

Difficulty: ${difficulty}
Experience: ${experience}

Requirements:

- The question should resemble Google, Meta, Amazon, Microsoft, Atlassian or D. E. Shaw interviews.
- The problem can belong to any DSA topic.
- Write ONE complete problem statement.
- Clearly describe the task.
- Clearly explain what needs to be computed.
- Include all necessary conditions for understanding the problem.
- Do NOT include examples.
- Do NOT include constraints.
- Do NOT include hints.
- Do NOT include the solution.
- Do NOT include a title.
- Do NOT use markdown.
- Keep the problem between 80 and 150 words.

Return ONLY the complete problem statement.
Do NOT greet the candidate.
Do NOT say "Let's begin" or "Here's your first problem."
Do NOT stop after one or two sentences.
`;

}

else if (interviewType === "HR") {

    prompt = `
You are an HR interviewer.

Generate ONE behavioural HR interview question.

Difficulty: ${difficulty}

Ask realistic HR questions commonly asked during software engineering placements.

Return only the question.
`;

}

else {

    prompt = `
You are a resume interviewer.

Generate ONE resume-based interview question based on the candidate's projects, internships, technologies, achievements, or experiences.

Experience: ${experience}

Rules:
- Ask only ONE question.
- Focus on:
  - Projects
  - Internships
  - Technologies used
  - Achievements
  - Design decisions
  - Challenges faced
- Do not ask HR or DSA questions.
- Return only the question.
`;

}

if (interviewType === "DSA") {
    return await generateGeminiResponse(prompt, false, 0.4);
}

return await generateGeminiResponse(prompt);
}

async function generateFollowUpQuestion(

    interviewType,

    role,

    experience,

    difficulty,
    currentQuestion,
    answer,
    conversation = [],
    questionNumber
) {
    const conversationHistory = conversation
        .slice(-4)
        .map(
            (item) => `
Interviewer: ${item.question}
Candidate: ${item.answer}
`
        )
        .join("\n");

    const prompt = `
${interviewType === "DSA"
? "You are conducting a realistic FAANG DSA interview."
: interviewType === "HR"
? "You are conducting a realistic HR interview."
: interviewType === "Resume"
? "You are conducting a realistic resume interview."
: "You are conducting a realistic software engineering interview."
}

Candidate:
${interviewType === "Technical" ? `Role: ${role}\n` : ""}
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

If interviewType is Technical:
- Ask another technical interview question relevant to the selected role.

If interviewType is DSA:
- Ask another coding question of the requested difficulty.

If interviewType is HR:
- Ask another HR interview question.

If interviewType is Resume:
- Ask another resume-based question.

Rules:
- Match the selected difficulty.
- Avoid repeating previously covered concepts.
- Ask only ONE new question.

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

The follow-up question must match the interview type.

Technical:
- Ask about concepts, design choices, trade-offs, real-world usage or implementation.
- Ask practical interview-style follow-up questions.

DSA:
- Ask whether a brute-force solution exists.
- Ask how the solution can be optimized.
- Ask for time complexity.
- Ask for space complexity.
- Ask about edge cases.
- Ask about alternative approaches if applicable.
- Ask implementation details only if they help evaluate the candidate.

HR:
- Ask behavioural or situational follow-up questions only.

Resume:
- Ask deeper questions about projects, technologies, internships or achievements mentioned.

Do not wrap the response in markdown.
Do not use triple backticks.
Return ONLY a valid JSON object.

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

    return await generateGeminiResponse(prompt, true);
}
async function generateInterviewEvaluation(

    conversation=[],

    interviewType="Technical"

){
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
You are an expert ${interviewType} interviewer.

Evaluate the candidate's interview performance based ONLY on the interview conversation below.

Interview Conversation:

${conversationHistory}

Evaluation Instructions:

Score the candidate fairly.

Consider:

If Technical:

- Technical knowledge
- Problem solving
- Communication

If DSA:

- Correctness
- Algorithm choice
- Optimization
- Time complexity
- Space complexity
- Edge cases
- Communication

If HR:

- Confidence
- Communication
- Behaviour
- Professionalism

If Resume:

- Resume understanding
- Project knowledge
- Communication
- Confidence
- Ability to explain projects

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
- Do not wrap the response in markdown.
- Do not use triple backticks.
- Return ONLY valid JSON.
`;

    return await generateGeminiResponse(prompt, true);
}

module.exports = {
    generateInterviewQuestion,
    generateFollowUpQuestion,
    generateInterviewEvaluation,
};