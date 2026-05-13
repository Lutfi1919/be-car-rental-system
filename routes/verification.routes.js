const express = require('express');
const router = express.Router();

const verificationController = require('../controllers/verification.controller')
const upload = require('../middlewares/upload')

router.post(
    '/', 
    upload.fields([
        { name: 'ktp_image', maxCount: 1 },
        { name: 'sim_image', maxCount: 1 }
    ]), 
    verificationController.createVerification
);
router.post('/:id', upload.none(), verificationController.updateVerification);
router.get('/', verificationController.getVerification);

module.exports = router