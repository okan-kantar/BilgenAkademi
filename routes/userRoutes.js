const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middleware/auth');

router.get('/', verifyAccessToken, userController.getAllUsers);
router.post('/', userController.createNewUser);
router.put('/', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
