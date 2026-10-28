const express = require('express');
const router = express.Router();
const { getTrainings, createTraining } = require('../controllers/trainingController');

router.route('/').get(getTrainings).post(createTraining);

module.exports = router;