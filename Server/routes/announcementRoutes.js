const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement } = require('../controllers/announcementController');

router.route('/').get(getAnnouncements).post(createAnnouncement);

module.exports = router;