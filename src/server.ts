import cors from 'cors';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware/error-handler.js';
import router from './routers/index.js';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/connect.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TaskBoard API',
      version: '1.0.0',
      description:
        'API for TaskBoard tasks, members, assignments, and statuses.',
    },
    // A relative URL makes Swagger call the same host serving these docs,
    // both locally and after deployment.
    servers: [{ url: '/' }],
    components: {
      schemas: {
        Member: {
          type: 'object',
          required: ['id', 'name', 'initials', 'color'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            initials: { type: 'string' },
            color: { type: 'string', example: '#7657e8' },
            email: { type: 'string', format: 'email' },
          },
        },
        Task: {
          type: 'object',
          required: [
            'id',
            'title',
            'description',
            'category',
            'status',
            'due',
            'members',
            'subtasks',
            'done',
            'priority',
          ],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            status: { type: 'string', enum: ['todo', 'progress', 'done'] },
            due: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format, or empty string',
            },
            members: {
              type: 'array',
              items: { type: 'string' },
              description: 'Assigned member IDs',
            },
            subtasks: { type: 'integer', minimum: 0 },
            done: { type: 'integer', minimum: 0 },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          },
        },
        Error: { type: 'object', properties: { error: { type: 'string' } } },
      },
    },
  },
  apis: ['./src/routers/*.ts'],
});

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', router);
app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectToDatabase();
  app.listen(port, () =>
    console.log(`TaskBoard API listening on http://localhost:${port}/api-docs`),
  );
}

startServer().catch((error: unknown) => {
  console.error('Failed to start TaskBoard API:', error);
  process.exitCode = 1;
});
