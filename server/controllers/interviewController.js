const {
    generateInterviewQuestion,
    generateFollowUpQuestion,
    generateInterviewEvaluation
} = require("../services/geminiService");
const Interview = require("../models/Interview");

exports.startInterview = async (req, res) => {
    try {
        const { role, experience, difficulty } = req.body;

        if (!role || !experience || !difficulty) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const question = await generateInterviewQuestion(
            role,
            experience,
            difficulty
        );

        return res.status(200).json({
            success: true,
            question,
        });

    } catch (error) {
        console.error("Submit answer error:", error);

        // Gemini API quota/rate limit reached
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


exports.submitAnswer = async (req, res) => {
    try {
        const {
            currentQuestion,
            answer,
            conversation,
            role,
            experience,
            difficulty,
            questionNumber
        } = req.body;

        if (!currentQuestion || !answer) {
            return res.status(400).json({
                success: false,
                message: "Question and answer are required"
            });
        }

        const result = await generateFollowUpQuestion(
            role,
            experience,
            difficulty,
            currentQuestion,
            answer,
            conversation,
            questionNumber
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

        const evaluation = await generateInterviewEvaluation(conversation);

        await Interview.create({
            user: req.user.id,

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