import {builder} from "../builder";
import {z} from "zod";

builder.queryField("tasks", (t) => t.prismaField({
    type: ["Task"],
    description: "Return tasks for a given list",
    args: {
        listId: t.arg.string({
            required: true,
            validate: {
                schema: z.string().uuid(),
            },
        }),
    },
    resolve: async (query, root, args, ctx, info)=>
        ctx.prisma.task.findMany({
            ...query,
            where: {
                taskListId: args.listId,
            },
        }),
}));

builder.queryField("task", (t) => t.prismaField({
    type: ["Task"],
    description: "Return a single task by id",
    args: {
        id: t.arg.string({
            required: true,
            validate: {
                schema: z.string().uuid(),
            },
        }),
    },
    resolve: async (query, root, args, ctx, info)=>
        ctx.prisma.task.findMany({
            ...query,
            where: {
                id: args.id,
            }
        }),
}));
