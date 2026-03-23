import express from 'express';
import { register, login, updateStats, getAllUsers } from '../controllers/userController.js';
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
 * /api/users/stats:
 *   post:
 *     summary: Update user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [unit, random]
 *               data:
 *                 type: object
 *                 properties:
 *                   unitId:
 *                     type: string
 *                   correctAnswers:
 *                     type: number
 *                   incorrectAnswers:
 *                     type: number
 *                   totalQuestions:
 *                     type: number
 *                   timeSpent:
 *                     type: number
 */
router.post('/stats', protect, updateStats);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users list (Auth required)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users list
 */
router.get('/', protect, getAllUsers);

export default router;
