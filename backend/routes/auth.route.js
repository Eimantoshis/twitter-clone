import express from 'express';
import dotenv from 'dotenv';
import { signup,login, logout, getMe } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

dotenv.config();

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


export default router;