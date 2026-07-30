const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            required: true,
        },

        conversation: [
            {
                question: {
                    type: String,
                    required: true,
                },

                answer: {
                    type: String,
                    required: true,
                },
            },
        ],

        overallScore: {
            type: Number,
            required: true,
        },

        technicalScore: {
            type: Number,
            required: true,
        },

        problemSolvingScore: {
            type: Number,
            required: true,
        },

        communicationScore: {
            type: Number,
            required: true,
        },

        confidenceScore: {
            type: Number,
            required: true,
        },

        strengths: [
            {
                type: String,
            },
        ],

        improvements: [
            {
                type: String,
            },
        ],

        feedback: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Interview", interviewSchema);