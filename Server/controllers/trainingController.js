const Training = require('../models/Training');

// @desc    Get all training programs
// @route   GET /api/trainings
const getTrainings = async (req, res) => {
    try {
        const trainings = await Training.find({}).populate('assignedEmployees', 'name email department');
        res.json(trainings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a training program
// @route   POST /api/trainings
const createTraining = async (req, res) => {
    try {
        const { title, description, instructor, duration, assignedEmployees } = req.body;

        const training = await Training.create({
            title,
            description,
            instructor,
            duration,
            assignedEmployees
        });

        res.status(201).json(training);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getTrainings, createTraining };