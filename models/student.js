const { mongoose } = require("../db");

const studentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    program: { type: String, required: true },
    section: { type: String, required: true },
    semester: { type: Number, default: 1 },
    balance: { type: Number, default: 0 },
    feePaid: { type: Number, default: 0 },
    address: { type: String, default: "" },
    place: { type: String, default: "" },
    collegeName: { type: String, default: "" },
    // semester -> { marks: number[], avvutaledu: number, avvali: number }
    marks: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = { Student };
