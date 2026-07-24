# task-list-api

Task list GraphQL API built with Node.js, TypeScript, Yoga, Pothos, Prisma, Zod, and Vitest.

I had to learn GraphQL while working on this take-home, so I kept the schema and resolver layout simple and split by domain.

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

2. Start Postgres with Docker:

```bash
docker compose up -d postgres
```

3. Create the Prisma client:

```bash
npm run prisma:generate
```

## Run

Start the server:

```bash
npm run dev
```

The GraphQL endpoint is:

```bash
http://localhost:4000/graphql
```

Run the tests:

```bash
npm test
```

## Decisions

### Pagination

I used offset pagination for `tasks`. It is easy to read, easy to test, and enough for this assignment.

### Error handling

Missing records throw typed GraphQL errors with a machine-readable `code` and a clear message. I used custom error helpers for that.

### Testing

I wrote tests for:

- partial task updates
- unknown task ids
- task pagination

I chose these because they cover the part of the API most likely to break: updates, not-found handling, and list slicing.

## Notes

- The database is PostgreSQL through Docker Compose.
- The test setup pushes the Prisma schema before the suite runs so the tests can start from a clean database.
- With more time, I would add more resolver tests, input validation tests, and probably a DataLoader to avoid N+1 queries when task lists load tasks.
