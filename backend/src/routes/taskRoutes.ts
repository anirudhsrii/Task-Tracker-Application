import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAnalytics,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getTasks).post(protect, createTask);
router.get('/analytics', protect, getAnalytics);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

export default router;
