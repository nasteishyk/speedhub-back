import express from 'express';
import { register, login, updateStats } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surname, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Anastasiia
 *               surname:
 *                 type: string
 *                 example: Kletsko
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 */
router.post('/register', register);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login user and get token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 */
router.post('/login', login);

/**
 * @openapi
 * /api/users/update-stats:
 *   post:
 *     summary: Update user test statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - data
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [unit, random, exam]
 *                 description: Test type (unit, random questions, or exam)
 *               data:
 *                 type: object
 *                 required:
 *                   - correctAnswers
 *                 properties:
 *                   correctAnswers:
 *                     type: integer
 *                     example: 18
 *                   incorrectAnswers:
 *                     type: integer
 *                     example: 2
 *                   totalQuestions:
 *                     type: integer
 *                     example: 20
 *                   timeSpent:
 *                     type: integer
 *                     description: Time in seconds
 *                     example: 450
 *                   unitId:
 *                     type: string
 *                     description: Unit ID (required for type=unit)
 *                     example: "r1"
 *     responses:
 *       200:
 *         description: Statistics successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statistics updated"
 *                 isPassed:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/update-stats', protect, updateStats);

// /**
//  * @openapi
//  * /api/users/stats:
//  *   post:
//  *     summary: Update user statistics
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               type:
//  *                 type: string
//  *                 enum: [unit, random]
//  *               data:
//  *                 type: object
//  *                 properties:
//  *                   unitId:
//  *                     type: string
//  *                   correctAnswers:
//  *                     type: number
//  *                   incorrectAnswers:
//  *                     type: number
//  *                   totalQuestions:
//  *                     type: number
//  *                   timeSpent:
//  *                     type: number
//  */
// router.post('/stats', protect, updateStats);

export default router;
