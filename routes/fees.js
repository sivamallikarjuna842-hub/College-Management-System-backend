// Fee routes
const express = require("express");
const router = express.Router();
const { requireAdminAuth } = require("../middleware/auth");
const { getFees, getStats } = require("../controllers/feeController");

router.use(requireAdminAuth);

router.get("/", getFees);
module.exports = router;