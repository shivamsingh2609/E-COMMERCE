
import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
import { placeOrder } from '../controllers/orderControllers.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, placeOrder);

export default router;
