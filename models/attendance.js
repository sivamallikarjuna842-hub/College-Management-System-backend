const { mongoose } = require("../db");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: Number, required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD

    // subjectKey -> 'P' | 'A'
    statusBySubject: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ studentId: 1, date: 1, createdAt: -1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = { Attendance };

