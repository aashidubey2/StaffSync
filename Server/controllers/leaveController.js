const Leave = require('../models/Leave');

// @desc    Apply for leave
// @route   POST /api/leaves
const applyLeave = async (req, res) => {
    try {
        const { employee, leaveType, startDate, endDate, reason } = req.body;

        const leave = await Leave.create({
            employee,
            leaveType,
            startDate,
            endDate,
            reason
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all leave requests
// @route   GET /api/leaves
const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({}).populate('employee', 'name email department');
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update leave status (approve/reject)
// @route   PUT /api/leaves/:id
const updateLeaveStatus = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = req.body.status || leave.status;
        const updatedLeave = await leave.save();

        res.json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus };