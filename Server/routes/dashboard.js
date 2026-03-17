const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboard");
const { verifyToken } = require("../middlewares/verifyJwtToken");

// Route: GET /dashboard
// Desc: Get dashboard data
// Access: Private (Admin)
router.get("/", verifyToken, getDashboard);

module.exports = router;
