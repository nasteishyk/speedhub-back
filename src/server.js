import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { connectMongoDB } from './config/db.js';
import questionsRoutes from './routes/questions.js';
import usersRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const app = express();

// 1. ПАРСЕРИ (Мають бути на самому початку)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Твій ЛОГГЕР (Тепер він бачитиме req.body)
app.use((req, res, next) => {
  console.log(`--- Новий запит: ${req.method} ${req.url} ---`);
  if (Object.keys(req.body).length > 0) {
    console.log('Дані запиту:', req.body);
  } else {
    console.log('Тіло запиту порожнє');
  }
  next();
});

// 3. ПІДКЛЮЧЕННЯ ДО МОНГО
connectMongoDB();

// 4. БЕЗПЕКА ТА CORS
app.use(helmet());

const corsOptions = {
  origin: ['http://localhost:3000', 'https://speedhub-neon.vercel.app'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 5. SWAGGER НАЛАШТУВАННЯ
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
        url: 'http://localhost:5000', // Додано localhost для тестів
        description: 'Local Server',
      },
      {
        url: 'https://speedhub-6fam.onrender.com',
        description: 'Production Server',
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

// 6. СТАТИЧНІ ФАЙЛИ
app.use(
  '/images',
  express.static(path.join(process.cwd(), 'src/public/images/testsImg')),
);
app.post('/test-register', (req, res) => {
  res.status(200).json({ message: "Сервер бачить запит!" });
});

// 7. РОУТИ API
app.use('/api/questions', questionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewRoutes);

// 8. ОБРОБКА ПОМИЛОК (Якщо прийшов кривий JSON)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📖 Documentation available at http://localhost:${PORT}/api-docs`,
  );
});
