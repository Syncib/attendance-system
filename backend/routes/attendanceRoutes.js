const express = require("express");
const {
  markAttendance,
  getAttendance,
  getAllAttendance,
  deleteAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

const requireAuth = require("../middleware/requireAuth");
const requireAdminAuth = require("../middleware/requireAdminAuth");
const router = express.Router();
router.use(requireAuth);
router.post("/mark-attendance", markAttendance);
router.post("/get-attendance/", getAttendance);
router.use(requireAdminAuth);
router.get("/get-all-attendance", getAllAttendance);
router.delete("/delete-attendance/:id", deleteAttendance);
router.patch("/update-attendance/:id", updateAttendance);
module.exports = router;
