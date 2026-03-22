import express from "express";
import {
  getAllQuestions,
  getRandomTest,
  getQuestionsByUnit
} from "../controllers/questionsController.js";

const router = express.Router();

/**
 * @openapi
 * /api/questions:
 *   get:
 *     summary: Отримати всі питання
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Успішно
 */
router.get("/", getAllQuestions);

/**
 * @openapi
 * /api/questions/test:
 *   get:
 *     summary: Випадковий тест
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Успішно
 */
router.get("/test", getRandomTest);

/**
 * @openapi
 * /api/questions/search-by-unit:
 *   get:
 *     summary: Пошук за розділом
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Успішно
 */
router.get("/search-by-unit", getQuestionsByUnit);

export default router;
