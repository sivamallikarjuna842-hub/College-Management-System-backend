// Student controller
const { Student } = require("../models/student");
const { useMemory, getStudents, getStudentById, addStudent, updateStudent, deleteStudent, saveMarks, getMarks, memoryStudents, getNextId } = require("../services/memoryStore");
const { parseNumber, gradeLabelFromAverage } = require("../utils/helpers");

// GET all students
async function getAllStudents(req, res) {
  try {
    if (!useMemory.value && Student) {
      const data = await Student.find({}).sort({ id: 1 }).lean();
      return res.json({ success: true, data });
    }
    const data = [...getStudents()].sort((a, b) => a.id - b.id);
    return res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
}

// POST add student
async function addNewStudent(req, res) {
  try {
    const { name, program, section, sem, balance, feePaid, address, place, collegeName } = req.body;

    if (!name || !program || !section) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, program, section",
      });
    }

    if (!useMemory.value && Student) {
      const last = await Student.findOne({}).sort({ id: -1 }).lean();
      const nextId = (last?.id ?? 0) + 1;
      const newStudent = await Student.create({
        id: nextId, name, program, section,
        semester: parseNumber(sem, 1),
        balance: parseNumber(balance, 0),
        feePaid: parseNumber(feePaid, 0),
        address: address || "", place: place || "",
        collegeName: collegeName || "", marks: {},
      });
      return res.status(201).json({ success: true, message: "Student added successfully", data: newStudent.toObject() });
    }

    const created = addStudent({
      name, program, section,
      semester: parseNumber(sem, 1),
      balance: parseNumber(balance, 0),
      feePaid: parseNumber(feePaid, 0),
      address: address || "", place: place || "",
      collegeName: collegeName || "",
    });
    return res.status(201).json({ success: true, message: "Student added successfully", data: created });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ success: false, message: "Failed to add student", details: error?.message });
  }
}

// GET student marks
async function getStudentMarks(req, res) {
  try {
    const studentId = parseInt(req.params.id, 10);

    if (!useMemory.value && Student) {
      const student = await Student.findOne({ id: studentId }).lean();
      if (!student) return res.status(404).json({ success: false, message: "Student not found" });
      return res.json({ success: true, data: student.marks || {} });
    }

    const marks = getMarks(studentId);
    if (marks === null) return res.status(404).json({ success: false, message: "Student not found" });
    return res.json({ success: true, data: marks });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch marks" });
  }
}

// POST save marks
async function saveStudentMarks(req, res) {
  try {
    const studentId = parseInt(req.params.id, 10);
    const semester = parseInt(req.params.sem, 10);
    const { marks, avvutaledu, avvali } = req.body;

    if (!marks || !Array.isArray(marks)) {
      return res.status(400).json({ success: false, message: "Invalid marks data" });
    }

    const safeAvvutaledu = parseNumber(avvutaledu, 0);
    const safeAvvali = parseNumber(avvali, 0);

    if (!useMemory.value && Student) {
      const student = await Student.findOne({ id: studentId });
      if (!student) return res.status(404).json({ success: false, message: "Student not found" });

      student.marks = student.marks || {};
      student.marks[semester] = {
        marks,
        avvutaledu: Number.isFinite(safeAvvutaledu) ? safeAvvutaledu : 0,
        avvali: Number.isFinite(safeAvvali) ? safeAvvali : 0,
      };

      const average = marks.length ? Math.round(marks.reduce((a, b) => a + b, 0) / marks.length) : 0;
      const gradeLabel = gradeLabelFromAverage(average);
      await student.save();

      return res.json({
        success: true, message: "Marks saved successfully",
        data: { marks, avvutaledu: student.marks[semester].avvutaledu, avvali: student.marks[semester].avvali, average, grade: gradeLabel },
      });
    }

    const saved = saveMarks(studentId, semester, {
      marks,
      avvutaledu: Number.isFinite(safeAvvutaledu) ? safeAvvutaledu : 0,
      avvali: Number.isFinite(safeAvvali) ? safeAvvali : 0,
    });

    if (saved === null) return res.status(404).json({ success: false, message: "Student not found" });

    const average = marks.length ? Math.round(marks.reduce((a, b) => a + b, 0) / marks.length) : 0;
    const gradeLabel = gradeLabelFromAverage(average);

    return res.json({
      success: true, message: "Marks saved successfully",
      data: { marks, avvutaledu: saved.avvutaledu, avvali: saved.avvali, average, grade: gradeLabel },
    });
  } catch (error) {
    console.error("Error saving marks:", error);
    res.status(500).json({ success: false, message: "Failed to save marks", details: error?.message });
  }
}

// POST deposit
async function depositPayment(req, res) {
  try {
    const studentId = parseInt(req.params.id, 10);
    const { amount, type } = req.body;

    if (!type || (type !== "fee" && type !== "balance")) {
      return res.status(400).json({ success: false, message: 'Invalid type. Use "fee" or "balance".' });
    }

    const depositAmount = parseNumber(amount, NaN);
    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    if (!useMemory.value && Student) {
      const student = await Student.findOne({ id: studentId });
      if (!student) return res.status(404).json({ success: false, message: "Student not found" });

      if (type === "fee") student.feePaid = (student.feePaid || 0) + depositAmount;
      else student.balance = (student.balance || 0) + depositAmount;

      await student.save();
      return res.json({ success: true, message: `${type === "fee" ? "Fee" : "Balance"} payment successful`, data: student.toObject() });
    }

    const student = getStudentById(studentId);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    if (type === "fee") student.feePaid = (student.feePaid || 0) + depositAmount;
    else student.balance = (student.balance || 0) + depositAmount;

    return res.json({ success: true, message: `${type === "fee" ? "Fee" : "Balance"} payment successful`, data: student });
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ success: false, message: "Failed to process payment", details: error?.message });
  }
}

// PUT update student
async function updateStudentRecord(req, res) {
  try {
    const studentId = parseInt(req.params.id, 10);

    if (!useMemory.value && Student) {
      const student = await Student.findOne({ id: studentId });
      if (!student) return res.status(404).json({ error: "Student not found" });

      Object.assign(student, req.body);
      await student.save();
      return res.json({ success: true, message: "Student updated", student: student.toObject() });
    }

    const student = updateStudent(studentId, req.body);
    if (!student) return res.status(404).json({ error: "Student not found" });
    return res.json({ success: true, message: "Student updated", student });
  } catch (error) {
    res.status(500).json({ error: "Failed to update student", details: error?.message });
  }
}

// DELETE student
async function deleteStudentRecord(req, res) {
  try {
    const studentId = parseInt(req.params.id, 10);

    if (!useMemory.value && Student) {
      const student = await Student.findOneAndDelete({ id: studentId });
      if (!student) return res.status(404).json({ error: "Student not found" });
      return res.json({ success: true, message: "Student deleted" });
    }

    const deleted = deleteStudent(studentId);
    if (!deleted) return res.status(404).json({ error: "Student not found" });
    return res.json({ success: true, message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student", details: error?.message });
  }
}

module.exports = { getAllStudents, addNewStudent, getStudentMarks, saveStudentMarks, depositPayment, updateStudentRecord, deleteStudentRecord };