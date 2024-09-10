const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: String },
    userName: { type: String },
    email: { type: String },
    isMarked: { type: Boolean, default: false },
    markDate: { type: String },
    isLeave: { type: Boolean, default: false },
    leaveReason: { type: String },
    isLeaveApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
