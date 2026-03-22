import express from 'express';
import {
  getAllQuestions,
  getRandomTest,
  getQuestionsByUnit,
} from '../controllers/questionsController.js';

const router = express.Router();

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
