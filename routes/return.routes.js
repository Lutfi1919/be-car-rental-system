const express = require('express');
const router = express.Router();

const returnController = require('../controllers/return.controller')
const upload = require('../middlewares/upload')

router.post('/', upload.none(), returnController.createReturn)
// router.post('/:id', upload.none(), returnController.changeStatus)
// router.get('/', returnController.getreturn)

module.exports = router