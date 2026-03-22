import express from 'express';
import {
  getAllQuestions,
  getRandomTest,
  getQuestionsByUnit,
} from '../controllers/questionsController.js';

const router = express.Router();

/**
 * @openapi
 * /api/questions/:
 * get:
 * summary: Отримати всі питання
 * tags: [Questions]
 * responses:
 * 200:
 * description: Список всіх питань з бази даних
 */
router.get('/', getAllQuestions);

/**
 * @openapi
 * /api/questions/test:
 * get:
 * summary: Згенерувати випадковий тест
 * description: Повертає 20 випадкових питань для тренування
 * tags: [Questions]
 * responses:
 * 200:
 * description: Масив з 20 випадкових об'єктів питань
 */
router.get('/test', getRandomTest);

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
 * description: Успішно знайдено питання розділу
 * 400:
 * description: Не вказано ID розділу
 * 404:
 * description: Питання для цього розділу не знайдені
 */
router.get('/search-by-unit', getQuestionsByUnit);

export default router;
