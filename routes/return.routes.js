const express = require('express');
const router = express.Router();

const returnController = require('../controllers/return.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), returnController.createReturn)

module.exports = router