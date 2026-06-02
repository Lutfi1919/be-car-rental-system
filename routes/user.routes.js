const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload')
const userController = require('../controllers/user.controller')

router.get('/', userController.getUser)
router.get('/profile', userController.getProfile)
router.put('/:id', upload.none(), userController.updateUser);
router.patch('/:id', upload.single('profile_image'), userController.updateProfileImage);
router.delete('/:id', userController.deleteUser);

module.exports = router