import express from 'express';
import { getAllUsers, getAllApplications, getStats } from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(protect, requireRole('admin'));

router.get('/users', getAllUsers);
router.get('/applications', getAllApplications);
router.get('/stats', getStats);

export default router;
