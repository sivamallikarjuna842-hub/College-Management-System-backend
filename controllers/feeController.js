// Fee and stats controller
const { Student } = require("../models/student");
const { useMemory, getStudents } = require("../services/memoryStore");
const { FEE_STRUCTURE } = require("../config");

// GET fee statistics
async function getFees(req, res) {
  try {
    const feeStructure = FEE_STRUCTURE;

    if (!useMemory.value && Student) {
      const students = await Student.find({}).lean();
      let totalCollected = 0;
      let totalPending = 0;

      students.forEach((s) => {
        const totalFee = feeStructure[s.program] || 0;
        totalCollected += s.feePaid || 0;
        totalPending += Math.max(0, totalFee - (s.feePaid || 0));
      });

      return res.json({ success: true, summary: { totalCollected, totalPending } });
    }

    let totalCollected = 0;
    let totalPending = 0;

    getStudents().forEach((s) => {
      const totalFee = feeStructure[s.program] || 0;
      totalCollected += s.feePaid || 0;
      totalPending += Math.max(0, totalFee - (s.feePaid || 0));
    });

    return res.json({ success: true, summary: { totalCollected, totalPending } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch fees", details: error?.message });
  }
}

// GET stats
async function getStats(req, res) {
  try {
    if (!useMemory.value && Student) {
      const stats = { totalStudents: 0, byGraduation: {}, bySections: {} };
      const students = await Student.find({}).lean();

      stats.totalStudents = students.length;
      students.forEach((s) => {
        stats.byGraduation[s.program] = (stats.byGraduation[s.program] || 0) + 1;
        stats.bySections[s.section] = (stats.bySections[s.section] || 0) + 1;
      });

      return res.json({ success: true, data: stats });
    }

    const stats = { totalStudents: 0, byGraduation: {}, bySections: {} };
    getStudents().forEach((s) => {
      stats.totalStudents++;
      stats.byGraduation[s.program] = (stats.byGraduation[s.program] || 0) + 1;
      stats.bySections[s.section] = (stats.bySections[s.section] || 0) + 1;
    });

    return res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats", details: error?.message });
  }
}

module.exports = { getFees, getStats };