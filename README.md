# TaskBoard backend

Standalone REST API for the TaskBoard frontend. This project uses Node.js, Express, TypeScript, Swagger UI, and MongoDB for persistence. It lives separately from the frontend and does not modify or connect to it.

## Run locally

```sh
npm install
npm run dev
```

The API listens at `http://localhost:3000` by default. Set `PORT` to use another port. Swagger UI is at `http://localhost:3000/api-docs`.

For a production build, run `npm run build` then `npm start`.

## Routes

- `GET /api/health`
- `GET /api/tasks`, `POST /api/tasks`
- `GET /api/tasks/:taskId`, `PATCH /api/tasks/:taskId`, `DELETE /api/tasks/:taskId`
- `GET /api/members`, `POST /api/members`, `DELETE /api/members/:memberId`

A task's `members` field is an array of member IDs, matching the frontend's existing data shape. Update that field with `PATCH /api/tasks/:taskId` to assign or unassign members. Update `status` with one of `todo`, `progress`, or `done`.

Tasks and members are saved in MongoDB. Set `DATABASE_URL` in `.env` to your MongoDB connection string. The API connects to MongoDB before it starts listening.

## Source layout

- `src/controllers` contains request handlers.
- `src/routers` maps API paths to handlers.
- `src/middleware` contains shared Express middleware such as error handling.
- `src/validation` contains request body validation.
- `src/models` contains domain types and Mongoose models.
- `src/utils` contains shared helpers such as ID generation and error responses.
