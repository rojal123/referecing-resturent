const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.listMenu);

module.exports = router;