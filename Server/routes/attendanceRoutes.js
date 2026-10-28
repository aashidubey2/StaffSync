const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance } = require('../controllers/attendanceController');

router.route('/').get(getAttendance).post(markAttendance);

module.exports = router;