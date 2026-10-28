const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Add a new employee
// @route   POST /api/employees
const createEmployee = async (req, res) => {
    try {
        const { user, name, email, department, position, salary, joinDate, phone, address } = req.body;

        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const employee = await Employee.create({
            user,
            name,
            email,
            department,
            position,
            salary,
            joinDate,
            phone,
            address
        });

        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getEmployees, createEmployee };