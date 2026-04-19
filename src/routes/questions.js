import express from 'express';
import {
  getAllQuestions,
  getRandomTest,
  getQuestionsByUnit,
  updateQuestion,
} from '../controllers/questionsController.js';
import { uploadQuestionsPhotos } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question (including uploading new images)
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo _id of the question
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: Question text
 *               customId:
 *                 type: string
 *                 description: Section text ID (e.g., r1q5)
 *               correct_option_id:
 *                 type: integer
 *                 description: ID of the correct answer (1, 2, 3...)
 *               options:
 *                 type: string
 *                 description: JSON string of options array (e.g., '["Yes", "No"]')
 *               existingImages:
 *                 type: string
 *                 description: JSON string of existing image URLs to keep
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New image files to upload (max. 5)
 *     responses:
 *       200:
 *         description: Question successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Question not found
 */
router.put('/:id', protect, isAdmin, uploadQuestionsPhotos, updateQuestion);

/**
 * @openapi
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getAllQuestions);

/**
 * @openapi
 * /api/questions/test:
 *   get:
 *     summary: Get a random test
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/test', getRandomTest);

/**
 * @openapi
 * /api/questions/search-by-unit:
 *   get:
 *     summary: Get questions by unit
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/search-by-unit', getQuestionsByUnit);

export default router;
