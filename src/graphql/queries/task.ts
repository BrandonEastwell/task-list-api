import {builder} from "../builder";
import {uuidSchema} from "../validation/schema";
import {notFound} from "../errors";
import {TaskPageType, TaskType} from "../schema";
import {TaskPageShape} from "../types";

builder.queryField("tasks", (t) =>
    t.field({
        type: TaskPageType,
        description: "Return tasks for a given list",
        args: {
            listId: t.arg.string({
                required: true,
                validate: {
                    schema: uuidSchema,
                },
            }),
            completed: t.arg.boolean(),
            limit: t.arg.int({
                required: false,
                defaultValue: 20
            }),
            offset: t.arg.int({
                required: false,
                defaultValue: 0
            })
        },
        resolve: async (root, args, ctx): Promise<TaskPageShape> => {
            const limit = args.limit ?? 20;
            const offset = args.offset ?? 0;

            const exists = await ctx.prisma.taskList.findUnique({
                where: {
                    id: args.listId
                },
                select: {
                    id: true
                },
            });

            if (!exists) {
                throw notFound("TaskList");
            }

            const where = {
                taskListId: args.listId,
                ...(args.completed !== null && args.completed !== undefined && {
                    completed: args.completed
                }),
            };

            const [items, total] = await ctx.prisma.$transaction([
                ctx.prisma.task.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
                }),
                ctx.prisma.task.count({
                    where,
                }),
            ]);

            return {
                items,
                totalCount: total,
                limit,
                offset,
                hasNextPage: offset + items.length < total,
            };
        },
    }),
);

builder.queryField("task", (t) => t.prismaField({
    type: TaskType,
    description: "Return a single task by id",
    args: {
        id: t.arg.string({
            required: true,
            validate: {
                schema: uuidSchema,
            },
        }),
    },
    resolve: async (query, root, args, ctx, info) => {
        const exists = await ctx.prisma.task.findUnique({
            where: { id: args.id }
        });

        if (!exists) throw notFound("Task");

        return ctx.prisma.task.findUnique({
            ...query,
            where: {
                id: args.id,
            }
        })
    }
}));
