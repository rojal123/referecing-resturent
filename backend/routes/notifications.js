const express = require('express');
const requireAuth = require('../Middleware/auth');
const notificationController = require('../controllers/notificationcontroller');

const router = express.Router();

router.use(requireAuth);

router.get('/', notificationController.getMine);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markRead);

module.exports = router;