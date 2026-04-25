import express from 'express';
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getApplications).post(createApplication);
router.route('/:id').get(getApplication).put(updateApplication).delete(deleteApplication);

export default router;
