// Student routes
const express = require("express");
const router = express.Router();
const { requireAdminAuth } = require("../middleware/auth");
const {
  getAllStudents,
  addNewStudent,
  getStudentMarks,
  saveStudentMarks,
  depositPayment,
  updateStudentRecord,
  deleteStudentRecord,
} = require("../controllers/studentController");

// All student routes require admin auth
router.use(requireAdminAuth);

router.get("/", getAllStudents);
router.post("/", addNewStudent);
router.put("/:id", updateStudentRecord);
router.delete("/:id", deleteStudentRecord);
router.get("/:id/marks", getStudentMarks);
router.post("/:id/marks/:sem", saveStudentMarks);
router.post("/:id/deposit", depositPayment);

module.exports = router;