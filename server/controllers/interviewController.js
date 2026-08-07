const {
    generateInterviewQuestion,
    generateFollowUpQuestion,
    generateInterviewEvaluation
} = require("../services/geminiService");
const Interview = require("../models/Interview");
const pdf = require("pdf-parse");



exports.startInterview = async (req, res) => {
    try {
        console.log("Body:", req.body);
        console.log("File:", req.file);
        const {
            interviewType,
            role,
            experience,
            difficulty,
        } = req.body || {};
        let resumeText = "";

        if (interviewType === "Resume" && req.file) {
            const data = await pdf(req.file.buffer);
            resumeText = data.text;

            console.log("Resume Text:");
            console.log(resumeText);
        }

        if (!interviewType || !experience || !difficulty) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        if (interviewType === "Technical" && !role) {
            return res.status(400).json({
                success: false,
                message: "Role is required for Technical Interview.",
            });
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
            question,
            resumeText,
        });

    } catch (error) {
        console.error("Start interview error:", error);

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
            conversation,
            interviewType,
            role,
            experience,
            difficulty,
            questionNumber,
            resumeText,
        } = req.body;

        if (!currentQuestion || !answer) {
            return res.status(400).json({
                success: false,
                message: "Question and answer are required"
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
        console.error("Submit answer error:", error);

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

        const {
            conversation,

            interviewType,

            role,

            experience,

            difficulty,

        } = req.body;

        if (!conversation || conversation.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Interview conversation is required",
            });
        }

        const evaluation = await generateInterviewEvaluation(
            conversation,
            interviewType
        );

        await Interview.create({
            user: req.user.id,

            interviewType,

            role,

            experience,

            difficulty,

            conversation,

            overallScore: evaluation.overallScore,
            technicalScore: evaluation.technicalScore,
            problemSolvingScore: evaluation.problemSolvingScore,
            communicationScore: evaluation.communicationScore,
            confidenceScore: evaluation.confidenceScore,

            strengths: evaluation.strengths,
            improvements: evaluation.improvements,
            feedback: evaluation.feedback,
        });

        return res.status(200).json({
            success: true,
            result: evaluation,
        });

    } catch (error) {

        console.error("Interview evaluation error:", error);

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

        console.error("History error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch interview history.",
        });

    }
};
exports.getDashboardAnalytics = async (req, res) => {
    try {

        const interviews = await Interview.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        const totalInterviews = interviews.length;

        const highestScore =
            totalInterviews > 0
                ? Math.max(...interviews.map(i => i.overallScore))
                : 0;

        const averageScore =
            totalInterviews > 0
                ? Math.round(
                    interviews.reduce(
                        (sum, interview) =>
                            sum + interview.overallScore,
                        0
                    ) / totalInterviews
                )
                : 0;

        const latestScore =
            totalInterviews > 0
                ? interviews[0].overallScore
                : 0;

        const recentInterviews = interviews.slice(0, 5);

        return res.status(200).json({
            success: true,

            analytics: {
                totalInterviews,
                averageScore,
                highestScore,
                latestScore,
            },

            recentInterviews,
        });

    } catch (error) {

        console.error("Dashboard analytics error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard analytics.",
        });

    }
};