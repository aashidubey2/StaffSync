const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee } = require('../controllers/employeeController');

// @route   GET /api/employees & POST /api/employees
router.route('/').get(getEmployees).post(createEmployee);

module.exports = router;