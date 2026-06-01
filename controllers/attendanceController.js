// Attendance controller
const { Attendance } = require("../models/attendance");
const { useMemory, setAttendance, getAttendance } = require("../services/memoryStore");

// POST mark attendance
async function markAttendance(req, res) {
  try {
    const studentId = req.body?.studentId;
    const date = req.body?.date;
    const statusBySubject = req.body?.statusBySubject;

    const parsedStudentId = parseInt(studentId, 10);
    if (!Number.isFinite(parsedStudentId)) {
      return res.status(400).json({ success: false, message: "Invalid studentId" });
    }

    const normalizedDate = String(date || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
      return res.status(400).json({ success: false, message: "Invalid date. Use YYYY-MM-DD" });
    }

    if (!statusBySubject) {
      return res.status(400).json({ success: false, message: "statusBySubject is required" });
    }

    let parsedStatusBySubject = statusBySubject;
    if (typeof statusBySubject === "string") {
      try {
        parsedStatusBySubject = JSON.parse(statusBySubject);
      } catch {
        return res.status(400).json({
          success: false,
          message: "statusBySubject must be an object or a valid JSON string",
        });
      }
    }

    if (typeof parsedStatusBySubject !== "object" || Array.isArray(parsedStatusBySubject)) {
      return res.status(400).json({ success: false, message: "statusBySubject must be an object" });
    }

    const clean = {};
    for (const [k, v] of Object.entries(parsedStatusBySubject)) {
      const status = String(v || "").toUpperCase().trim();
      if (status === "P" || status === "A") clean[k] = status;
    }

    if (!useMemory.value && Attendance) {
      const doc = await Attendance.create({ studentId: parsedStudentId, date: normalizedDate, statusBySubject: clean });
      return res.json({ success: true, message: "Attendance saved", data: doc.toObject() });
    }

    const record = setAttendance(parsedStudentId, normalizedDate, clean);
    return res.json({ success: true, message: "Attendance saved", data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save attendance", details: error?.message });
  }
}

// GET attendance
async function getAttendanceRecord(req, res) {
  try {
    const studentId = parseInt(req.params.studentId, 10);
    if (!Number.isFinite(studentId)) return res.status(400).json({ success: false, message: "Invalid studentId" });

    const date = String(req.query.date || "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: "Invalid date. Use YYYY-MM-DD" });
    }

    if (!useMemory.value && Attendance) {
      const docs = await Attendance.find({ studentId, date }).sort({ createdAt: -1 }).lean();
      if (!docs || docs.length === 0) {
        return res.status(404).json({ success: false, message: "Attendance not found" });
      }
      return res.json({ success: true, data: docs });
    }

    const record = getAttendance(studentId, date);
    if (!record) return res.status(404).json({ success: false, message: "Attendance not found" });
    return res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch attendance", details: error?.message });
  }
}

module.exports = { markAttendance, getAttendanceRecord };