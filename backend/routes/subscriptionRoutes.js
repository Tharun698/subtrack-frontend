import express from 'express';
import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription,
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getSubscriptions).post(createSubscription);
router.route('/:id').put(updateSubscription).delete(deleteSubscription);

export default router;
