import dotenv from 'dotenv';
// 1. dotenv.config() МАЄ БУТИ ПЕРШИМ РЯДКОМ!
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { connectMongoDB } from './config/db.js';

// Тільки після dotenv.config() імпортуємо роути
import questionsRoutes from './routes/questions.js';
import usersRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const app = express();

app.set('trust proxy', 1);

// ПАРСЕРИ (теж на початку)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectMongoDB();

// HELMET (без блокування Swagger)
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Забагато запитів з цього IP, спробуйте пізніше.' },
});
app.use('/api/', limiter);

// CORS (з credentials: true для роботи з куками)
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://speedhub-neon.vercel.app',
    'https://speedhub-6fam.onrender.com',
  ],
  credentials: true, // ВАЖЛИВО: для авторизації
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SpeedHub API',
      version: '1.0.0',
      description: 'API для SpeedHub',
    },
    servers: [{ url: 'https://speedhub-6fam.onrender.com' }],
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

// СТАТИКА ТА РОУТИ
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
