import express from "express";
import { getAllQuestions, getRandomTest, getQuestionsByUnit } from "../controllers/questionsController.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/test", getRandomTest);
router.get("/search-by-unit", getQuestionsByUnit);

export default router;
