const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login.controller')
const upload = require('../middlewares/upload')

router.post('/login', upload.none(), loginController.login)
router.post('/register', upload.none(), loginController.register)

module.exports = router