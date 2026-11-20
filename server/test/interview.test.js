const { test } = require("node:test");
const assert = require("node:assert/strict");
const { Types } = require("mongoose");

process.env.GEMINI_API_KEY = "offline-test";
const { startInterview, submitAnswer, evaluateInterview } = require("../controllers/interviewController");
const Interview = require("../models/Interview");

const settings = { interviewType: "HR", experience: "Fresher", difficulty: "Easy" };
const turn = { question: "How did you handle a disagreement?", answer: "We compared the options together." };
const user = { id: new Types.ObjectId().toString() };
function response() {
    return {
        code: 200,
        status(code) { this.code = code; return this; },
        json(body) { this.body = body; return this; },
    };
}

function modelResponse(value) {
    return Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(value) }] } }] });
}

test("a resume interview requires a readable PDF before requesting a question", async t => {
    const ai = t.mock.method(globalThis, "fetch", () => { throw Error("Unexpected AI request"); });
    for (const buffer of [null, Buffer.from("A Word document"), Buffer.from("%PDF-unreadable")]) {
        const res = response();
        await startInterview({ body: { ...settings, interviewType: "Resume" }, file: buffer && { buffer } }, res);
        assert.equal(res.code, 400);
    }
    assert.equal(ai.mock.callCount(), 0);
});

test("the first question cannot end an interview and a follow-up stays on the same topic", async t => {
    const replies = [{ type: "END_INTERVIEW" }, { type: "FOLLOW_UP", question: "What was the outcome?" }];
    t.mock.method(globalThis, "fetch", () => modelResponse(replies.shift()));
    const res = response();
    await submitAnswer({ body: { ...settings, currentQuestion: turn.question, answer: turn.answer, questionNumber: 1 } }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.type, "FOLLOW_UP");
    assert.equal(replies.length, 0);
});

test("question ten cannot advance to an eleventh main question", async t => {
    const replies = [{ type: "NEXT_QUESTION", question: "Another question?" }, { type: "END_INTERVIEW" }];
    t.mock.method(globalThis, "fetch", () => modelResponse(replies.shift()));
    const res = response();
    await submitAnswer({ body: { ...settings, currentQuestion: turn.question, answer: turn.answer, questionNumber: 10 } }, res);
    assert.equal(res.body.type, "END_INTERVIEW");
    assert.equal(replies.length, 0);
});

test("a rate-limited request returns an actionable response immediately", async t => {
    const ai = t.mock.method(globalThis, "fetch", () => Response.json({ error: { message: "Quota reached" } }, { status: 429 }));
    const res = response();
    await startInterview({ body: settings }, res);
    assert.equal(res.code, 429);
    assert.equal(ai.mock.callCount(), 1);
});

test("a retry returns the saved evaluation and an incomplete scorecard is never stored", async t => {
    const evaluation = { overallScore: 70, technicalScore: 65, problemSolvingScore: 75,
        communicationScore: 70, confidenceScore: 70, strengths: ["Clear", "Relevant", "Specific"],
        improvements: ["Quantify the result", "Give context", "Discuss alternatives"], feedback: "Explain the outcome." };
    const replies = [{ overallScore: 800 }, evaluation];
    const ai = t.mock.method(globalThis, "fetch", () => modelResponse(replies.shift()));
    const interviewId = new Types.ObjectId().toString();
    let saved;
    t.mock.method(Interview.collection, "findOne", filter => {
        assert.equal(String(filter.user), user.id);
        assert.equal(String(filter._id), interviewId);
        return saved || null;
    });
    const write = t.mock.method(Interview.collection, "findOneAndUpdate", (filter, update, options) => {
        assert.equal(String(filter.user), user.id);
        assert.equal(String(filter._id), interviewId);
        assert.equal(options.upsert, true);
        assert.equal(update.$setOnInsert.conversation.length, 1);
        saved = Object.fromEntries(Object.keys(evaluation).map(key => [key, update.$setOnInsert[key]]));
        return saved;
    });
    for (let attempt = 0; attempt < 2; attempt++) {
        const res = response();
        await evaluateInterview({ user, body: { ...settings, interviewId, conversation: [turn] } }, res);
        assert.equal(res.code, 200);
        assert.deepEqual(res.body.result, evaluation);
    }
    assert.equal(ai.mock.callCount(), 2);
    assert.equal(write.mock.callCount(), 1);
});
