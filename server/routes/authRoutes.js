const express = require("express");
const router = express.Router();

const { signup, login, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile", authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
});

module.exports = router;