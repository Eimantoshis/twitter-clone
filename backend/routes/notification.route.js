import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getNotifications, deleteNotifications, getUnreadCount } from '../controllers/notification.controller.js';

const router = express.Router();


router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.get("/unread-count", protectRoute, getUnreadCount);


export default router;