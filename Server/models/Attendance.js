const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    checkInTime: { type: String, required: true },
    checkOutTime: { type: String },
    status: { 
        type: String, 
        enum: ['Present', 'Absent', 'Half Day', 'Late'], 
        default: 'Present' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);