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
                ...(args.completed !== null &&
                    args.completed !== undefined && {
                        completed: args.completed,
                    }),
            };

            const [items, total] = await ctx.prisma.$transaction([
                ctx.prisma.task.findMany({
                    where,
                    skip: args.offset ?? 0,
                    take: args.limit ?? 20,
                    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
                }),
                ctx.prisma.task.count({
                    where,
                }),
            ]);

            return {
                items,
                totalCount: total,
                limit: items.length,
                offset: 0,
                hasNextPage: false,
            };
        },
    }),
);

builder.queryField("task", (t) => t.prismaField({
    type: [TaskType],
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
        const exists = ctx.prisma.task.findUnique({
            where: { id: args.id }
        })

        if (!exists) throw notFound("Task")

        return ctx.prisma.task.findMany({
            ...query,
            where: {
                id: args.id,
            }
        })
    }
}));
