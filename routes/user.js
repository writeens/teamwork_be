const express = require('express');

const router = express.Router();


const userCtrl = require('../controllers/user');

router.post('/create-user', userCtrl.createUser);

router.post('/signin', userCtrl.signIn);

module.exports = router;
