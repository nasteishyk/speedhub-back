import express from 'express';
import {
  createReview,
  getAllReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *
 *   post:
 *     summary: Create a new review (Auth required)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 example: This app helped me pass my driving test!
 *               photo:
 *                 type: string
 *                 example: https://example.com/my-photo.jpg
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.get('/', getAllReviews);
router.post('/', protect, createReview);

export default router;
