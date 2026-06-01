// Helper utility functions

function parseNumber(val, fallback = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function gradeLabelFromAverage(average) {
  if (average >= 90) return "O";
  if (average >= 80) return "A+";
  if (average >= 70) return "A";
  if (average >= 60) return "B+";
  if (average >= 50) return "B";
  if (average >= 40) return "C";
  return "F";
}

module.exports = { parseNumber, gradeLabelFromAverage };