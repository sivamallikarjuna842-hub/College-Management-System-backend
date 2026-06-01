// Attendance routes
const express = require("express");
const router = express.Router();
const { requireAdminAuth } = require("../middleware/auth");
const { markAttendance, getAttendanceRecord } = require("../controllers/attendanceController");

// All attendance routes require admin auth
router.use(requireAdminAuth);

router.post("/mark", markAttendance);
router.get("/:studentId", getAttendanceRecord);

module.exports = router;