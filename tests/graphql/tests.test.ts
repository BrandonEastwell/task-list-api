import {beforeEach, describe, expect, it} from "vitest";

import {prisma} from "../../src/db/prisma";
import {yoga} from "../../src/server";

type SeededData = {
    taskListId: string;
    taskIds: string[];
};

describe.sequential("Task integration", () => {
    let seeded: SeededData;

    const execute = (query: string, variables?: Record<string, unknown>) =>
        yoga.fetch("http://localhost/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({query, variables}),
        });

    beforeEach(async () => {
        await prisma.task.deleteMany();
        await prisma.taskList.deleteMany();

        const taskList = await prisma.taskList.create({
            data: {
                name: "Work",
                createdAt: new Date("2026-07-24T00:00:00.000Z"),
            },
        });

        const tasks = [
            await prisma.task.create({
                data: {
                    title: "Write tests",
                    completed: false,
                    createdAt: new Date("2026-07-24T00:00:00.000Z"),
                    taskListId: taskList.id,
                },
            }),
            await prisma.task.create({
                data: {
                    title: "Review PR",
                    completed: true,
                    createdAt: new Date("2026-07-24T00:01:00.000Z"),
                    taskListId: taskList.id,
                },
            }),
            await prisma.task.create({
                data: {
                    title: "Deploy",
                    completed: false,
                    createdAt: new Date("2026-07-24T00:02:00.000Z"),
                    taskListId: taskList.id,
                },
            }),
        ];

        seeded = {
            taskListId: taskList.id,
            taskIds: tasks.map((task) => task.id),
        };
    });

    it("updates a task partially", async () => {
        const response = await execute(
            `
            mutation UpdateTask($id: ID!, $title: String) {
              updateTask(id: $id, title: $title) {
                id
                title
                completed
              }
            }
            `,
            {
                id: seeded.taskIds[0],
                title: "Write integration tests",
            },
        );

        const body = await response.json() as {
            data?: {
                updateTask?: {
                    id: string;
                    title: string;
                    completed: boolean;
                };
            };
            errors?: Array<{ message: string }>;
        };

        expect(body.errors).toBeUndefined();
        expect(body.data?.updateTask).toEqual({
            id: seeded.taskIds[0],
            title: "Write integration tests",
            completed: false,
        });

        const updated = await prisma.task.findUnique({
            where: {id: seeded.taskIds[0]},
        });

        expect(updated?.title).toBe("Write integration tests");
        expect(updated?.completed).toBe(false);
    });

    it("returns a typed error for an unknown task id", async () => {
        const response = await execute(
            `
            query Task($id: String!) {
              task(id: $id) {
                id
              }
            }
            `,
            {
                id: "00000000-0000-4000-8000-000000000000",
            },
        );

        const body = await response.json() as {
            data?: { task: null };
            errors?: Array<{
                message: string;
                extensions?: { code?: string };
            }>;
        };

        expect(body.data).toEqual({task: null});
        expect(body.errors?.[0]?.message).toBe("Task was not found.");
        expect(body.errors?.[0]?.extensions?.code).toBe("NOT_FOUND");
    });

    it("paginates task results", async () => {
        const response = await execute(
            `
            query Tasks($listId: String!, $limit: Int!, $offset: Int!) {
              tasks(listId: $listId, limit: $limit, offset: $offset) {
                totalCount
                limit
                offset
                hasNextPage
                items {
                  id
                  title
                  completed
                }
              }
            }
            `,
            {
                listId: seeded.taskListId,
                limit: 2,
                offset: 1,
            },
        );

        const body = await response.json() as {
            data?: {
                tasks?: {
                    totalCount: number;
                    limit: number;
                    offset: number;
                    hasNextPage: boolean;
                    items: Array<{
                        id: string;
                        title: string;
                        completed: boolean;
                    }>;
                };
            };
            errors?: Array<{ message: string }>;
        };

        expect(body.errors).toBeUndefined();
        expect(body.data?.tasks).toEqual({
            totalCount: 3,
            limit: 2,
            offset: 1,
            hasNextPage: false,
            items: [
                {
                    id: seeded.taskIds[1],
                    title: "Review PR",
                    completed: true,
                },
                {
                    id: seeded.taskIds[2],
                    title: "Deploy",
                    completed: false,
                },
            ],
        });
    });
});
