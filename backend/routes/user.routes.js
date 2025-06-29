import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();


router.get("/profile/:username",protectRoute, getUserProfile);
router.post("/suggested",protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute,  updateUser);


export default router;