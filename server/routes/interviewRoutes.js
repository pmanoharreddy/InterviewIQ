const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 6 },
});

const {
    startInterview,
    submitAnswer,
    evaluateInterview,
    getInterviewHistory,
    getDashboardAnalytics,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/start",
    authMiddleware,
    (req, res, next) => {
        upload.single("resume")(req, res, error => {
            if (!error) return next();
            const tooLarge = error.code === "LIMIT_FILE_SIZE";
            return res.status(tooLarge ? 413 : 400).json({
                success: false,
                message: tooLarge ? "Your PDF must be 5 MB or smaller." : "Upload one PDF resume.",
            });
        });
    },
    startInterview
);

router.post(
    "/answer",
    authMiddleware,
    submitAnswer
);
router.get("/test", (req, res) => {
    res.send("Interview routes are working");
});

router.post(
    "/evaluate",
    authMiddleware,
    evaluateInterview
);

router.get(
    "/history",
    authMiddleware,
    getInterviewHistory
);

router.get(
    "/dashboard",
    authMiddleware,
    getDashboardAnalytics
);

module.exports = router;