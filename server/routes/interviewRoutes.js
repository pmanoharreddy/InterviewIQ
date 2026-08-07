const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
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
    upload.single("resume"),
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