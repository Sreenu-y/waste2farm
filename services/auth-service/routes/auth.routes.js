const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../../shared/auth');
const { validate, registerSchema, loginSchema } = require('../../shared/validators');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

module.exports = router;
