const Attendance = require('../models/Attendance');

// @desc    Mark attendance
// @route   POST /api/attendance
const markAttendance = async (req, res) => {
    try {
        const { employee, date, status } = req.body;

        // Check if attendance already marked for this date
        const existingAttendance = await Attendance.findOne({ employee, date });
        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for this date' });
        }

        const attendance = await Attendance.create({
            employee,
            date,
            status
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
const getAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({}).populate('employee', 'name email department');
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { markAttendance, getAttendance };