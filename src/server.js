import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet"; // Захист заголовків
import rateLimit from "express-rate-limit"; // Захист від спаму
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { connectMongoDB } from "./config/db.js";
import questionsRoutes from "./routes/questions.js";

dotenv.config();

const app = express();

// 1. ПІДКЛЮЧЕННЯ ДО БД
connectMongoDB();

// 2. ЗАХИСТ (Security Middlewares)
app.use(helmet()); // Встановлює безпечні HTTP-заголовки

// Обмеження кількості запитів (захист від DDoS/спаму)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 100, // ліміт 100 запитів з однієї IP-адреси
  message: "Забагато запитів з цього IP, спробуйте пізніше."
});
app.use("/api/", limiter);

// Налаштування CORS (дозволяємо запити лише з твого фронтенда після деплою)
const corsOptions = {
  origin: [
    "http://localhost:5173", // для розробки
    "https://speedhub-neon.vercel.app" // на Vercel
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// 3. SWAGGER КОНФІГУРАЦІЯ
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SpeedHub API",
      version: "1.0.0",
      description: "Документація API для SpeedHub з вбудованим захистом",
    },
    servers: [{ url: "https://speedhub-6fam.onrender.com" }],
  },
  apis: ["./src/routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 4. СТАТИКА ТА РОУТИ
app.use("/images", express.static(path.join(process.cwd(), "src/public/images/testsImg")));
app.use("/api/questions", questionsRoutes);

// ПОРТ
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
