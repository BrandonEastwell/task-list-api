# task-list-api

Task list GraphQL API built with Node.js, TypeScript, Yoga, Pothos, Prisma, Zod, and Vitest.

I had to learn GraphQL while working on this take-home, so I kept the schema split by domain and the setup steps simple.

## What It Does

- `TaskList` has an `id`, `name`, `createdAt`, and many tasks
- `Task` has an `id`, `title`, `completed`, `createdAt`, `updatedAt`, and a `taskListId`
- Queries:
  - `taskLists`
  - `tasks`
  - `task`
- Mutations:
  - `addTaskList`
  - `addTask`
  - `updateTask`
  - `deleteTask`

All query and mutation inputs are checked with Zod.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env
```

3. Start Postgres with Docker:

```bash
docker compose up -d postgres
```

4. Create the Prisma client:

```bash
npm run prisma:generate
```

5. Push the schema to the database:

```bash
npx prisma db push
```

## Run

Start the server:

```bash
npm run dev
```

GraphQL runs at:

```bash
http://localhost:4000/graphql
```

Run the tests:

```bash
npm test
```

## Decisions

### Pagination

I used offset pagination for `tasks`. It is easy to read and easy to test, which fits this assignment well.

I also returned a `TaskPage` object instead of a plain task array so the client gets the page items and the pagination details together in one response. That keeps the API simple to use and leaves room for extra page metadata later without changing the shape again.

### Error handling

If a task or task list is missing, I throw a typed GraphQL error with a machine-readable `code` and a plain message. That keeps the client response consistent and avoids raw Prisma errors.

### Testing

I wrote tests for:

- partial task updates
- unknown task ids
- task pagination

I picked those because they cover the main resolver behavior that is easy to get wrong:

- partial updates should only change the fields that were sent
- missing task ids should return a typed `NOT_FOUND` error
- pagination should return the right slice of tasks and page details

## Notes

- The database runs in PostgreSQL through Docker Compose.
- The test setup runs `prisma db push` before the suite starts, so tests can begin with a clean schema.
- With more time, I would add more resolver tests, more input validation tests, and a DataLoader for task list lookups to avoid N+1 queries.
