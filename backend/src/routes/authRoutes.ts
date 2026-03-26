import express from 'express';
import { check } from 'express-validator';
import { registerUser, authUser } from '../controllers/authController';

const router = express.Router();

router.post(
  '/register',
  [
    check('username', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authUser
);

export default router;
