const Attendance = require("../models/Attendance");
const mongoose = require("mongoose");
const User = require("../models/User");
const markAttendance = async (req, res) => {
  const {
    userId,
    userName,
    email,
    isMarked,
    markDate,
    isLeave,
    leaveReason,
    isLeaveApproved,
  } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const name = user.name;

      // Create attendance without setting the _id field
      const attendance = await Attendance.create({
        userId,
        userName,
        email,
        name,
        isMarked,
        markDate,
        isLeave,
        leaveReason,
        isLeaveApproved,
      });

      res
        .status(201)
        .json({ message: "Attendance marked successfully", attendance });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAttendance = async (req, res) => {
  const { email, markDate } = req.body;
  try {
    const attendance = await Attendance.findOne({ email, markDate });
    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({}).sort({ createdAt: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAttendance = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    const attendance = await Attendance.findOneAndDelete({ _id: id });
    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }
    res
      .status(200)
      .json({ message: "Attendance deleted successfully", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAttendance = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }
    res
      .status(200)
      .json({ message: "Attendance updated successfully", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markAttendance,
  getAllAttendance,
  deleteAttendance,
  updateAttendance,
  getAttendance,
};
