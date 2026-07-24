import {builder} from "../builder";
import {uuidSchema} from "../validation/schema";
import {notFound} from "../errors";
import {TaskType} from "../schema";

builder.queryField("tasks", (t) => t.prismaField({
    type: [TaskType],
    description: "Return tasks for a given list",
    args: {
        listId: t.arg.string({
            required: true,
            validate: {
                schema: uuidSchema,
            },
        }),
    },
    resolve: async (query, root, args, ctx, info) => {
        const exists = ctx.prisma.taskList.findUnique({
            where: { id: args.listId }
        })

        if (!exists) throw notFound("TaskList")

        return ctx.prisma.task.findMany({
            ...query,
            where: {
                taskListId: args.listId,
            },
        })
    }
}));

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
