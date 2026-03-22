import express from 'express';
import { register, login, updateStats } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Тільки для авторизованих (треба передавати Header: Authorization Bearer <token>)
router.post('/stats', protect, updateStats);

export default router;
