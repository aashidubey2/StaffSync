const express = require('express');
const router = express.Router();
const { applyLeave, getLeaves, updateLeaveStatus } = require('../controllers/leaveController');

router.route('/').get(getLeaves).post(applyLeave);
router.route('/:id').put(updateLeaveStatus);

module.exports = router;