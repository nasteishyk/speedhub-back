import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { connectMongoDB } from './config/db.js';
import questionsRoutes from './routes/questions.js';
import usersRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const app = express();

// 1. ПАРСЕРИ (Мають бути на початку)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. ПІДКЛЮЧЕННЯ БАЗИ
connectMongoDB();

// 3. БЕЗПЕКА (Helmet налаштований так, щоб не блокувати Swagger)
app.use(
  helmet({
    contentSecurityPolicy: false, // Дозволяє Swagger коректно відображатися
  }),
);

// 4. LIMITER (Вимикаємо для адмінських запитів або збільшуємо ліміт для тестів)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Збільшив ліміт до 500, щоб не було 403 при тестах
  message: { error: 'Забагато запитів з цього IP, спробуйте пізніше.' },
});
app.use('/api/', limiter);

// 5. CORS (Додав посилання на сам Render, щоб API могло звертатися до себе)
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://speedhub-neon.vercel.app',
    'https://speedhub-6fam.onrender.com',
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 6. SWAGGER (Динамічні сервери)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SpeedHub API',
      version: '1.0.0',
      description: 'Документація API для SpeedHub з підтримкою JWT-авторизації',
    },
    servers: [
      {
        url: '/', // Магія: автоматично бере поточний домен (localhost або render)
        description: 'Current Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 7. СТАТИКА ТА РОУТИ
app.use(
  '/images',
  express.static(path.join(process.cwd(), 'src/public/images/testsImg')),
);

app.use('/api/questions', questionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
