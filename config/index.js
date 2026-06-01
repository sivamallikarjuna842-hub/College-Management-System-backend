// Backend configuration constants
const FEE_STRUCTURE = {
  "B.Tech": 85000,
  "BBA": 55000,
  "M.Tech": 95000,
  Degree: 45000,
  MBA: 110000,
  BCA: 50000,
};

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "vastundi";
const PORT = process.env.PORT || 5000;

module.exports = {
  FEE_STRUCTURE,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  PORT,
};