// Authentication controller
const bcrypt = require("bcryptjs");
const { ADMIN_PASSWORD, ADMIN_USERNAME } = require("../config");
const { signAdminToken } = require("../middleware/auth");

let adminPasswordHash = null;

async function loginHandler(req, res) {
  try {
    const body = req.body || {};
    const username = body.username ?? req.query?.username ?? req.headers["x-username"];
    const password = body.password ?? req.query?.password ?? req.headers["x-password"];

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password required",
        debug: {
          body: body && Object.keys(body).length ? body : {},
          query: req.query || {},
          headers: {
            "x-username": req.headers["x-username"],
            "x-password": req.headers["x-password"],
            "content-type": req.headers["content-type"],
          },
        },
      });
    }

    if (!adminPasswordHash) {
      adminPasswordHash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
    }

    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), adminPasswordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = signAdminToken(ADMIN_USERNAME);
    return res.json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Login failed", details: err?.message });
  }
}

module.exports = { loginHandler };