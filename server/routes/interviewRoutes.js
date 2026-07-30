const express = require("express");
const router = express.Router();

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