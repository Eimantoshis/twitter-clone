import express from 'express';
import dotenv from 'dotenv';
import { signup,login, logout } from '../controllers/auth.controller.js';

dotenv.config();

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;