// In-memory fallback data store (used when MongoDB is down)

let memoryStudents = [
  {
    id: 3001,
    name: "Ravi Kumar",
    program: "B.Tech",
    section: "A",
    semester: 3,
    balance: 12000,
    feePaid: 70000,
    address: "12-4, MG Road, Hyderabad",
    place: "Hyderabad",
    collegeName: "Sai Vidya Institute of Technology",
    marks: {
      1: { marks: [88, 75, 90, 82, 78, 91, 85, 79, 88, 92], avvutaledu: 0, avvali: 0 },
      2: { marks: [80, 72, 88, 76, 82, 89, 91, 77, 85, 90], avvutaledu: 0, avvali: 0 },
    },
  },
  {
    id: 3002,
    name: "Priya Reddy",
    program: "BBA",
    section: "B",
    semester: 2,
    balance: 8500,
    feePaid: 45000,
    address: "5-6, Banjara Hills, Hyderabad",
    place: "Hyderabad",
    collegeName: "Sai Vidya Institute of Technology",
    marks: {
      1: { marks: [92, 88, 76, 84, 90, 78, 85, 91, 80, 87], avvutaledu: 0, avvali: 0 },
    },
  },
  {
    id: 3003,
    name: "Arjun Sharma",
    program: "M.Tech",
    section: "A",
    semester: 2,
    balance: 15000,
    feePaid: 80000,
    address: "23, Jubilee Hills, Hyderabad",
    place: "Hyderabad",
    collegeName: "Sai Vidya Institute of Technology",
    marks: {
      1: { marks: [78, 85, 90, 82, 88, 91, 76, 89, 84, 92], avvutaledu: 0, avvali: 0 },
    },
  },
];

let nextMemoryId = 3004;

// Attendance store (key: `${studentId}:${date}`)
const memoryAttendance = new Map();
const getAttendanceKey = (studentId, date) => `${studentId}:${date}`;

const useMemory = { value: false };

function getStudents() {
  return memoryStudents;
}

function getStudentById(id) {
  return memoryStudents.find((s) => s.id === id);
}

function addStudent(student) {
  const newId = nextMemoryId++;
  const created = { id: newId, ...student, marks: student.marks || {} };
  memoryStudents.push(created);
  return created;
}

function updateStudent(id, data) {
  const student = memoryStudents.find((s) => s.id === id);
  if (!student) return null;
  Object.assign(student, data);
  return student;
}

function deleteStudent(id) {
  const idx = memoryStudents.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  memoryStudents.splice(idx, 1);
  return true;
}

function saveMarks(studentId, semester, marksData) {
  const student = memoryStudents.find((s) => s.id === studentId);
  if (!student) return null;
  student.marks = student.marks || {};
  student.marks[semester] = marksData;
  return student.marks[semester];
}

function getMarks(studentId) {
  const student = memoryStudents.find((s) => s.id === studentId);
  if (!student) return null;
  return student.marks || {};
}

function setAttendance(studentId, date, statusBySubject) {
  const key = getAttendanceKey(studentId, date);
  const record = { studentId, date, statusBySubject };
  memoryAttendance.set(key, record);
  return record;
}

function getAttendance(studentId, date) {
  const key = getAttendanceKey(studentId, date);
  return memoryAttendance.get(key) || null;
}

function getNextId() {
  return nextMemoryId;
}

module.exports = {
  useMemory,
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  saveMarks,
  getMarks,
  setAttendance,
  getAttendance,
  getNextId,
  memoryStudents,
  memoryAttendance,
};