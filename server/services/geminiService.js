const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Model constant
const MODEL = "gemini-flash-latest";

// Configuration constants
const CONFIG = {
    DSA: {
        maxOutputTokens: 2048,
        temperature: 0.5,
        topP: 0.95,
        topK: 40,
    },
    TECHNICAL: {
        maxOutputTokens: 1500,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
    },
    HR: {
        maxOutputTokens: 800,
        temperature: 0.8,
        topP: 0.9,
        topK: 50,
    },
    RESUME: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
    },
    EVALUATION: {
        maxOutputTokens: 2500,
        temperature: 0.3,
        topP: 0.9,
        topK: 20,
    },
    FOLLOW_UP: {
        maxOutputTokens: 1800,
        temperature: 0.6,
        topP: 0.9,
        topK: 40,
    }
};

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

// Validate response completeness
function isResponseComplete(text, expectJSON = false, interviewType = null) {
    if (!text || text.trim().length === 0) {
        console.warn("⚠️ Empty response detected");
        return false;
    }

    if (expectJSON) {
        try {
            const parsed = parseGeminiJSON(text);
            // Validate required fields exist
            if (parsed.type !== undefined || parsed.overallScore !== undefined) {
                return true;
            }
            console.warn("⚠️ JSON missing required fields");
            return false;
        } catch {
            console.warn("⚠️ Invalid JSON response");
            return false;
        }
    }

    const trimmed = text.trim();
    const lastChar = trimmed.slice(-1);
    const lastWord = trimmed.split(/\s+/).pop();

    // 1. Check proper ending
    const validEndings = ['.', '?', '!'];
    if (!validEndings.includes(lastChar)) {
        console.warn("⚠️ Missing proper punctuation, last char:", lastChar);
        return false;
    }

    // 2. Check for incomplete words (common in truncation)
    const incompletePatterns = /\b(serv|dat|comput|algo|implement|optim|proces|rout|calculat|determ|prob|quest)$/i;
    if (incompletePatterns.test(lastWord)) {
        console.warn("⚠️ Detected incomplete word:", lastWord);
        return false;
    }

    // 3. DSA-specific validation
    if (interviewType === "DSA") {
        const wordCount = trimmed.split(/\s+/).length;
        
        if (wordCount < 50) {
            console.warn("⚠️ DSA question too short:", wordCount, "words");
            return false;
        }

        // Should contain problem description keywords
        const hasTaskDescription = /\b(given|find|return|calculate|determine|design|implement|write|create)\b/i.test(trimmed);
        if (!hasTaskDescription) {
            console.warn("⚠️ Missing task description");
            return false;
        }
    }

    // 4. Minimum length check for all types
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 10) {
        console.warn("⚠️ Response too short:", wordCount, "words");
        return false;
    }

    return true;
}

async function generateGeminiResponse(
    prompt,
    expectJSON = false,
    temperature = 0.7,
    maxRetries = 3,
    maxOutputTokens = 2048,
    interviewType = null
) {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Slightly increase temperature on retries to avoid same truncation
            const adjustedTemp = attempt > 1 ? Math.min(temperature + (attempt * 0.1), 1.0) : temperature;

            const response = await ai.models.generateContent({
                model: MODEL,
                contents: prompt,
                config: {
                    temperature: adjustedTemp,
                    maxOutputTokens,
                    topP: 0.95,
                    topK: 40,
                    ...(expectJSON && { responseMimeType: "application/json" }),
                },
            });

            const text = response.text?.trim() || "";

            // Debugging
            console.log(`\n========== GEMINI RESPONSE (Attempt ${attempt}) ==========`);
            console.log(text);
            console.log(`Estimated tokens: ~${Math.ceil(text.split(/\s+/).length * 1.3)}`);
            console.log("=====================================\n");

            // Validate completeness
            if (!isResponseComplete(text, expectJSON, interviewType)) {
                if (attempt < maxRetries) {
                    console.log(`🔄 Retrying incomplete response (attempt ${attempt + 1}/${maxRetries})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    continue;
                }
                throw new Error("Response incomplete after all retries");
            }

            if (expectJSON) {
                return parseGeminiJSON(text);
            }

            return text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .replace(/^#+\s*/gm, "")
                .trim();

        } catch (err) {
            lastError = err;
            console.error(`❌ Gemini attempt ${attempt}/${maxRetries} failed:`, err.message);

            if (attempt < maxRetries) {
                // Exponential backoff
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`⏳ Waiting ${delay}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw new Error(`Gemini failed after ${maxRetries} attempts: ${lastError?.message}`);
}

async function generateInterviewQuestion(
    interviewType,
    role,
    experience,
    difficulty,
    resumeText = ""
) {
    let prompt = "";
    let config = CONFIG.TECHNICAL;

    if (interviewType === "Technical") {
        config = CONFIG.TECHNICAL;

        // Enhanced technical prompt based on role
        const roleSpecificTopics = {
            "Backend": "REST APIs, microservices, caching, databases, message queues, API design",
            "Frontend": "React/Vue/Angular, state management, performance optimization, responsive design, browser APIs",
            "Full Stack": "Frontend and backend integration, REST APIs, databases, deployment, authentication",
            "DevOps": "CI/CD, Docker, Kubernetes, cloud platforms, monitoring, infrastructure as code",
            "Mobile": "Mobile app architecture, native vs cross-platform, state management, offline support",
            "Data Science": "ML algorithms, data preprocessing, model evaluation, feature engineering",
            "QA": "Testing strategies, automation frameworks, test design, CI/CD integration"
        };

        const topics = roleSpecificTopics[role] || "core computer science concepts";

        prompt = `
You are an expert software engineering interviewer.

Generate ONLY ONE interview question.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}

Rules:

- Ask ONE technical interview question relevant to ${role} developers.
- Questions should be related to:
  - Operating Systems (processes, threads, memory management, scheduling, deadlocks)
  - DBMS (indexing, transactions, ACID, normalization, query optimization, SQL vs NoSQL)
  - OOP (SOLID principles, design patterns, inheritance, polymorphism)
  - Computer Networks (TCP/IP, HTTP/HTTPS, DNS, load balancing, CDN)
  - Software Engineering (design principles, testing, debugging, version control)
  - Role-specific technologies: ${topics}
  
- Frame the question conversationally, like a real interviewer would ask.
- Do NOT ask DSA or coding questions.
- Do NOT include the answer.
- Do NOT use markdown formatting.
- Return only the question.
- The question must be complete and end with a question mark.
`;

    } else if (interviewType === "DSA") {
        config = CONFIG.DSA;

        // Difficulty descriptions for better calibration
        const difficultyGuide = {
            "Easy": "single concept, standard algorithms (two pointers, sliding window, hash maps), clear optimal solutions",
            "Medium": "multiple concepts combined, requires optimization thinking, similar to Meta/Google L3-L4 questions",
            "Hard": "complex algorithms (dynamic programming, advanced graphs, tries), multiple optimization layers, similar to Meta/Google L5+ questions"
        };

        const guide = difficultyGuide[difficulty] || difficultyGuide["Medium"];

        prompt = `
You are an experienced FAANG software engineer conducting a live coding interview.

Generate EXACTLY ONE complete coding interview problem.

Difficulty: ${difficulty} (${guide})
Experience: ${experience}

CRITICAL REQUIREMENTS:

1. COMPLETENESS:
   - Write the ENTIRE problem statement from start to finish
   - Do NOT stop mid-sentence
   - End with a period (.)
   - The problem must be fully understandable on its own
   - MUST be between 100-180 words

2. STRUCTURE:
   - Clearly describe the input/scenario
   - Clearly explain the task
   - Clearly state what needs to be computed or returned
   - Include all necessary conditions for understanding
   - Mention input format if relevant

3. STYLE:
   - Resemble real Google, Meta, Amazon, Microsoft, or D.E. Shaw interviews
   - Professional and conversational tone
   - No markdown formatting
   - No title, header, or "Problem:" label
   - No examples, constraints, hints, or solutions
   - No function signatures

4. FORBIDDEN:
   - Do NOT greet the candidate
   - Do NOT say "Here's your problem" or "Let's begin"
   - Do NOT include partial sentences
   - Do NOT stop abruptly
   - Do NOT truncate the problem

5. QUALITY CHECK:
   - Re-read your response before finishing
   - Ensure the last sentence is complete
   - Ensure the problem is solvable with the given information



Now generate ONE complete DSA problem following ALL the rules above.

PROBLEM STATEMENT:
`;

    } else if (interviewType === "HR") {
        config = CONFIG.HR;

        prompt = `
You are an HR interviewer for a software engineering role.

Generate ONE behavioural HR interview question.

Difficulty: ${difficulty}
Experience: ${experience}

Ask realistic HR questions commonly asked during software engineering placements at top companies.

Question categories:
- Behavioral (teamwork, conflict resolution, leadership)
- Situational (handling pressure, deadlines, failures)
- Motivational (career goals, company fit, learning)
- Past experiences (achievements, challenges, growth)

Rules:
- Ask only ONE question.
- Keep it conversational and natural.
- Frame it like a real HR interviewer would ask.
- Do NOT include answer guidance.
- Do NOT use markdown.
- Return only the question.
- End with a question mark.
`;

    } else {
    config = CONFIG.RESUME;

    prompt = `
You are an experienced software engineering interviewer.

The candidate has uploaded the following resume.

================ RESUME ================

${resumeText}

========================================

Experience: ${experience}

Rules:

- Read the resume carefully.
- Ask ONLY ONE interview question.
- The question MUST be based on the uploaded resume.
- Prefer asking about:
  1. Projects
  2. Technologies used
  3. Design decisions
  4. Challenges faced
  5. Internships
  6. Achievements

- Do NOT ask generic technical questions unless they relate to the resume.
- Do NOT ask DSA questions.
- Do NOT ask HR questions.
- Do NOT include the answer.
- Return ONLY the interview question.
- End with a question mark.
`;
}

    return await generateGeminiResponse(
        prompt,
        false,
        config.temperature,
        3,
        config.maxOutputTokens,
        interviewType
    );
}

async function generateFollowUpQuestion(
    interviewType,
    role,
    experience,
    difficulty,
    currentQuestion,
    answer,
    conversation = [],
    questionNumber,
    resumeText = ""
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

    const config = CONFIG.FOLLOW_UP;

    const prompt = `
${interviewType === "DSA"
    ? "You are conducting a realistic FAANG DSA coding interview."
    : interviewType === "HR"
    ? "You are conducting a realistic HR interview for a software engineering role."
    : interviewType === "Resume"
    ? "You are conducting a realistic resume-based technical interview."
    : "You are conducting a realistic software engineering technical interview."
}

Candidate Profile:
${interviewType === "Technical" ? `Role: ${role}\n` : ""}Experience: ${experience}
Difficulty: ${difficulty}

${
    interviewType === "Resume"
        ? `
Candidate Resume:
==============================
${resumeText}
==============================
`
        : ""
}

Interview Progress:
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
- The answer is incorrect or partially incorrect.
- The answer is incomplete, vague, or unclear.
- You need to test deeper understanding of the concept.
- For DSA: complexity has not been discussed when it's relevant.
- For DSA: an optimization exists but wasn't mentioned.
- For DSA: important edge cases or implementation details should be explored.
- For Technical: a follow-up can test deeper knowledge.

If interviewType is Resume:

- If the candidate gives a vague or incomplete explanation about a project,
  ask a follow-up about that SAME project.
- Ask deeper questions about:
  - Architecture
  - Design decisions
  - Challenges faced
  - Authentication
  - Database choice
  - APIs
  - Deployment
  - Optimizations
- Never jump to another project until the current project has been explored.
- Do not repeat previous follow-up questions.

When using FOLLOW_UP for DSA/coding:
- First, let them explain their approach if they haven't.
- Ask about time and space complexity ONLY if not already discussed.
- Ask for optimization ONLY if a better approach exists.
- Ask about edge cases ONLY if critical ones were missed.
- Ask about implementation details ONLY if it helps evaluate understanding.
- Do NOT ask something they already explained clearly.
- Do NOT ask all of these for every problem.
- Keep it conversational and natural.

Natural DSA follow-up examples:
- "What would be the time complexity of your approach?"
- "Can you think of a way to optimize this further?"
- "How would your solution handle an empty input?"
- "What happens if all elements are negative?"

2. NEXT_QUESTION

Use NEXT_QUESTION when:
- The candidate has demonstrated sufficient understanding of the current topic.
- Important follow-ups have already been answered.
- Further questioning would become repetitive or unhelpful.
- The candidate's answer was comprehensive and correct.

When choosing NEXT_QUESTION:

If interviewType is Technical:
- Ask another technical interview question relevant to the selected role: ${role}.
- Cover different concepts from previous questions.
- Match the selected difficulty: ${difficulty}.



If interviewType is DSA:
- Ask another coding question of difficulty: ${difficulty}.
- Choose a different algorithmic concept from previous questions.
- Follow the same DSA problem generation rules.

If interviewType is HR:
- Ask another behavioral/situational HR question.
- Focus on different aspects (teamwork, leadership, conflict, motivation, etc.).

If interviewType is Resume:

- Read the uploaded resume carefully.
- Ask ONLY questions based on the uploaded resume.
- Use the previous conversation to avoid repeating questions.
- Continue naturally from the last topic.

Question priority:

1. Projects
2. Project architecture
3. Technologies used
4. Challenges faced
5. Design decisions
6. Optimizations
7. Authentication
8. Databases
9. APIs
10. Deployment
11. Skills
12. Certifications
13. Achievements

Rules:

- Never ask generic Java, React, DBMS or DSA questions unless they directly relate to something written in the resume.
- If InterviewIQ has already been discussed, move to Course Scheduler.
- If Course Scheduler has already been discussed, move to StayNest.
- If projects are finished, move to technical skills.
- If technical skills are finished, move to certifications and achievements.
- Never repeat a previously discussed project.
- Ask only ONE question.

Rules for NEXT_QUESTION:
- Match the selected difficulty.
- Avoid repeating previously covered concepts.
- Ask only ONE new question.
- Make it feel like a natural interview progression.
- Do NOT include markdown.

3. END_INTERVIEW

Use END_INTERVIEW only when:
- The current main question number is exactly 10.
- The candidate has sufficiently answered the final question,
  OR useful follow-ups for the final question have been completed.
- There is no meaningful reason to continue the final topic.

IMPORTANT INTERVIEW RULES:

- Ask only ONE question at a time.
- Do not provide the answer or solution.
- Do not include praise, feedback, explanations, or scoring.
- Do not ask something the candidate has already clearly answered.
- Do not keep drilling into a topic unnecessarily.
- Follow-ups should feel natural, not like a rigid checklist.
- Be conversational and professional.

QUESTION NUMBER RULES:

- If questionNumber is less than 10:
    You may return FOLLOW_UP or NEXT_QUESTION.
    NEVER return END_INTERVIEW.

- If questionNumber is 10:
    You may return FOLLOW_UP if another useful follow-up is needed.
    NEVER return NEXT_QUESTION (no 11th question allowed).
    Once the final topic has been sufficiently explored,
    return END_INTERVIEW.

- NEVER generate an 11th main question.

Return ONLY a valid JSON object.
Do not wrap the response in markdown.
Do not use triple backticks.

For a follow-up question:

{
    "type": "FOLLOW_UP",
    "question": "Your follow-up question here?"
}

For a new main question:

{
    "type": "NEXT_QUESTION",
    "question": "Your new interview question here?"
}

When the interview is complete:

{
    "type": "END_INTERVIEW",
    "question": null
}
`;

    return await generateGeminiResponse(
        prompt,
        true,
        config.temperature,
        3,
        config.maxOutputTokens,
        "FOLLOW_UP"
    );
}

async function generateInterviewEvaluation(
    conversation = [],
    interviewType = "Technical"
) {
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

    const config = CONFIG.EVALUATION;

    // Evaluation criteria based on interview type
    const evaluationCriteria = {
        "Technical": `
- Technical knowledge and accuracy
- Depth of understanding
- Ability to explain concepts clearly
- Problem-solving approach
- Communication skills`,
        
        "DSA": `
- Correctness of approach
- Algorithm choice and optimization
- Time and space complexity analysis
- Edge case handling
- Code clarity and problem-solving process
- Communication during problem-solving`,
        
        "HR": `
- Confidence and professionalism
- Communication skills
- Self-awareness
- Behavioral examples (STAR method)
- Cultural fit indicators
- Enthusiasm and motivation`,
        
        "Resume": `
- Project knowledge and depth
- Technical skills demonstration
- Understanding of technologies used
- Ability to explain design decisions
- Problem-solving in real projects
- Communication and confidence`
    };

    const criteria = evaluationCriteria[interviewType] || evaluationCriteria["Technical"];

    const prompt = `
You are an expert ${interviewType} interviewer evaluating a candidate's performance.

Evaluate the candidate's interview performance based ONLY on the interview conversation below.

Interview Type: ${interviewType}

Interview Conversation:
${conversationHistory}

Evaluation Instructions:

Score the candidate fairly and realistically based on the conversation.

Evaluation Criteria:
${criteria}

Scoring Guide (be strict and realistic):

90-100 = Outstanding (exceptional answers, deep understanding, perfect communication)
80-89 = Very Good (strong answers, good understanding, clear communication)
70-79 = Good (decent answers, adequate understanding, acceptable communication)
60-69 = Average (basic answers, surface-level understanding, unclear at times)
50-59 = Below Average (weak answers, limited understanding, poor communication)
Below 50 = Poor (incorrect answers, no understanding, very poor communication)

IMPORTANT:
- Do NOT give perfect scores unless truly deserved.
- Be realistic and fair.
- Most candidates should score between 60-80.
- Scores above 85 should be rare and only for exceptional performance.
- Base scores ONLY on what was discussed in the conversation.

Provide exactly 3 strengths and exactly 3 improvements.
Write feedback that is constructive, specific, and between 80-150 words.

Return ONLY valid JSON in this exact format:

{
    "overallScore": 0,
    "technicalScore": 0,
    "problemSolvingScore": 0,
    "communicationScore": 0,
    "confidenceScore": 0,
    "strengths": [
        "First strength",
        "Second strength",
        "Third strength"
    ],
    "improvements": [
        "First area for improvement",
        "Second area for improvement",
        "Third area for improvement"
    ],
    "feedback": "Detailed feedback paragraph here"
}

Rules:
- All scores must be integers between 0-100.
- Strengths array must have exactly 3 items.
- Improvements array must have exactly 3 items.
- Feedback must be between 80-150 words.
- Do not wrap the response in markdown.
- Do not use triple backticks.
- Return ONLY valid JSON.
`;

    return await generateGeminiResponse(
        prompt,
        true,
        config.temperature,
        3,
        config.maxOutputTokens,
        "EVALUATION"
    );
}

module.exports = {
    generateInterviewQuestion,
    generateFollowUpQuestion,
    generateInterviewEvaluation,
};