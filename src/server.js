import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet'; // Захист заголовків
import rateLimit from 'express-rate-limit'; // Захист від спаму
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { connectMongoDB } from './config/db.js';
import questionsRoutes from './routes/questions.js';
import usersRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const app = express();

connectMongoDB();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Забагато запитів з цього IP, спробуйте пізніше.',
});
app.use('/api/', limiter);

const corsOptions = {
  origin: [
    'http://localhost:5173', // для розробки
    'https://speedhub-neon.vercel.app', // на Vercel
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

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
        url: 'https://speedhub-6fam.onrender.com',
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  '/images',
  express.static(path.join(process.cwd(), 'src/public/images/testsImg')),
);
app.use('/api/questions', questionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
