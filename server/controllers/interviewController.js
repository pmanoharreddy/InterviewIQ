const {
    generateInterviewQuestion,
    generateFollowUpQuestion,
    generateInterviewEvaluation
} = require("../services/geminiService");
const Interview = require("../models/Interview");
const pdf = require("pdf-parse");
const { Types } = require("mongoose");

const hasText = value => typeof value === "string" && value.trim().length > 0;
const validTurns = turns => Array.isArray(turns) &&
    turns.every(turn => hasText(turn?.question) && hasText(turn?.answer));

function validSettings({ interviewType, role, difficulty, experience }) {
    return ["HR", "Technical", "DSA", "Resume"].includes(interviewType) &&
        hasText(difficulty) && hasText(experience) &&
        (interviewType !== "Technical" || hasText(role));
}



exports.startInterview = async (req, res) => {
    try {
        const settings = req.body || {};
        if (!validSettings(settings)) {
            return res.status(400).json({ success: false, message: "Choose an interview type, experience and difficulty, and a role for technical interviews." });
        }
        const { interviewType, role, experience, difficulty } = settings;
        let resumeText = "";
        if (interviewType === "Resume") {
            if (req.file?.buffer.subarray(0, 5).toString() !== "%PDF-") {
                return res.status(400).json({ success: false, message: "Upload your resume as a PDF." });
            }
            try {
                const data = await pdf(req.file.buffer);
                resumeText = data.text.trim();
            } catch {
                return res.status(400).json({ success: false, message: "This PDF could not be read. Upload an unlocked, text-based PDF." });
            }
            if (!resumeText || resumeText.length > 20000) {
                return res.status(400).json({ success: false, message: "Use a PDF with selectable text and at most 20,000 characters." });
            }
        }

        const question = await generateInterviewQuestion(
            interviewType,
            role,
            experience,
            difficulty,
            resumeText
        );

        return res.status(200).json({
            success: true,
            interviewId: new Types.ObjectId(),
            question,
            resumeText,
        });

    } catch (error) {
        console.error("Start interview error:", error.name);

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message: "AI request limit reached. Please try again later."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to start interview."
        });
    }
};


exports.submitAnswer = async (req, res) => {
    try {
        const {
            currentQuestion,
            answer,
            conversation = [],
            interviewType,
            role,
            experience,
            difficulty,
            questionNumber,
            resumeText,
        } = req.body || {};

        if (!validSettings(req.body || {}) || !hasText(currentQuestion) || !hasText(answer) ||
            !validTurns(conversation) || !Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > 10) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid interview, question number and answer."
            });
        }

        const result = await generateFollowUpQuestion(
            interviewType,
            role,
            experience,
            difficulty,
            currentQuestion,
            answer,
            conversation,
            questionNumber,
            resumeText
        );

        return res.status(200).json({
            success: true,
            type: result.type,
            nextQuestion: result.question
        });

    } catch (error) {
        console.error("Submit answer error:", error.name);

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message: "AI request limit reached. Please try again later."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to process answer"
        });
    }
};
exports.evaluateInterview = async (req, res) => {
    try {

        const { interviewId, conversation, interviewType, role, experience, difficulty } = req.body || {};
        if (!validSettings(req.body || {}) || !validTurns(conversation) || !conversation.length ||
            (interviewId !== undefined && !Types.ObjectId.isValid(interviewId))) {
            return res.status(400).json({ success: false, message: "Valid interview settings and answered questions are required." });
        }

        const filter = { _id: interviewId || new Types.ObjectId(), user: req.user.id };
        const fields = ["overallScore", "technicalScore", "problemSolvingScore", "communicationScore",
            "confidenceScore", "strengths", "improvements", "feedback"];
        const scoreFields = fields.join(" ") + " -_id";
        const existing = interviewId && await Interview.findOne(filter).select(scoreFields).lean();
        if (existing) return res.json({ success: true, result: existing });

        const evaluation = await generateInterviewEvaluation(conversation, interviewType);
        const record = { interviewType, role, experience, difficulty, conversation };
        for (const field of fields) record[field] = evaluation[field];
        // A repeated submission returns the first saved evaluation for this user's session.
        let result;
        try {
            result = await Interview.findOneAndUpdate(filter, { $setOnInsert: record }, {
                upsert: true, returnDocument: "after", runValidators: true, projection: scoreFields,
            }).lean();
        } catch (error) {
            if (error.code !== 11000) throw error;
            result = await Interview.findOne(filter).select(scoreFields).lean();
            if (!result) return res.status(409).json({ success: false, message: "This session could not be saved." });
        }
        return res.json({ success: true, result });

    } catch (error) {

        console.error("Interview evaluation error:", error.name);

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                message: "AI request limit reached. Please try again later.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to evaluate interview.",
        });
    }
};
exports.getInterviewHistory = async (req, res) => {
    try {

        const interviews = await Interview.find({
            user: req.user.id,
        })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            interviews,
        });

    } catch (error) {

        console.error("History error:", error.name);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch interview history.",
        });

    }
};
exports.getDashboardAnalytics = async (req, res) => {
    try {

        const [dashboard] = await Interview.aggregate([
            { $match: { user: new Types.ObjectId(req.user.id) } },
            { $sort: { createdAt: -1, _id: -1 } },
            { $facet: {
                stats: [{ $group: {
                    _id: null,
                    totalInterviews: { $sum: 1 },
                    averageScore: { $avg: "$overallScore" },
                    highestScore: { $max: "$overallScore" },
                    latestScore: { $first: "$overallScore" },
                } }],
                recentInterviews: [{ $limit: 5 }],
            } },
        ]);
        const stats = dashboard.stats[0];
        return res.json({
            success: true,
            analytics: {
                totalInterviews: stats?.totalInterviews ?? 0,
                averageScore: Math.round(stats?.averageScore ?? 0),
                highestScore: stats?.highestScore ?? 0,
                latestScore: stats?.latestScore ?? 0,
            },
            recentInterviews: dashboard.recentInterviews,
        });

    } catch (error) {

        console.error("Dashboard analytics error:", error.name);

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard analytics.",
        });

    }
};