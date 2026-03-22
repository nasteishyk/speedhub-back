import express from "express";
import { getAllQuestions, getRandomTest, getQuestionsByUnit } from "../controllers/questionsController.js";

const router = express.Router();

/**
 * @openapi
 * /api/questions/:
 * get:
 * summary: Отримати всі питання
 * tags: [Questions]
 * responses:
 * 200:
 * description: Список всіх питань
 */
router.get("/", getAllQuestions);

/**
 * @openapi
 * /api/questions/test:
 * get:
 * summary: Згенерувати випадковий тест
 * tags: [Questions]
 * responses:
 * 200:
 * description: Масив з 20 випадкових питань
 */
router.get("/test", getRandomTest);

/**
 * @openapi
 * /api/questions/search-by-unit:
 * get:
 * summary: Пошук питань за номером розділу
 * tags: [Questions]
 * parameters:
 * - in: query
 * name: id
 * required: true
 * schema:
 * type: string
 * description: Номер розділу (наприклад, 1 або r1)
 * responses:
 * 200:
 * description: Успішно знайдено питання
 * 400:
 * description: Не вказано ID
 * 404:
 * description: Питання не знайдені
 */
router.get("/search-by-unit", getQuestionsByUnit);

export default router;
