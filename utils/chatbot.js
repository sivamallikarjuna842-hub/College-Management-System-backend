// Rule-based chatbot reply logic

function normalizeChatText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function chatbotReply(prompt) {
  const q = normalizeChatText(prompt);

  if (!q) {
    return {
      success: true,
      message: "Ask about attendance, students, fees, or marks.",
      intent: "help",
    };
  }

  if (q.includes("attendance")) {
    return {
      success: true,
      message:
        "Attendance APIs: POST /api/attendance/mark and GET /api/attendance/:studentId?date=YYYY-MM-DD. Tell me studentId and date.",
      intent: "attendance",
    };
  }

  if (q.includes("mark") && q.includes("attendance")) {
    return {
      success: true,
      message:
        "Use POST /api/attendance/mark with body { studentId, date, statusBySubject }. Example: { studentId: 3001, date: '2026-05-15', statusBySubject: { math: 'P', eng: 'A' } }",
      intent: "attendance_mark",
    };
  }

  if (q.includes("fee") || q.includes("fees") || q.includes("payment")) {
    return { success: true, message: "Fees APIs: GET /api/fees and GET /api/stats.", intent: "fees" };
  }

  if (q.includes("student") || q.includes("students")) {
    return { success: true, message: "Students APIs: GET /api/students and GET /api/students/:id.", intent: "students" };
  }

  if (q.includes("marks") || q.includes("result")) {
    return {
      success: true,
      message:
        "Marks APIs: GET /api/students/:id/marks and POST /api/students/:id/marks/:sem.",
      intent: "marks",
    };
  }

  return {
    success: true,
    message:
      "I'm a rule-based assistant. Try asking: 'attendance', 'fees', 'students', or 'marks'.",
    intent: "unknown",
  };
}

module.exports = { chatbotReply };