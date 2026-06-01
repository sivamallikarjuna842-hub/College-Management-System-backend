// JWT authentication middleware
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN, ADMIN_USERNAME, ADMIN_PASSWORD } = require("../config");

let adminPasswordHash = null;

function ensureAdminPasswordHash() {
  if (!adminPasswordHash) {
    adminPasswordHash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
  }
}

function signAdminToken(username) {
  return jwt.sign({ sub: "admin", username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function requireAdminAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.sub !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

module.exports = { ensureAdminPasswordHash, signAdminToken, requireAdminAuth, ADMIN_USERNAME, ADMIN_PASSWORD };