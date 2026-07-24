import {builder} from "../builder";
import {z} from "zod";

builder.mutationField("addTask", (t) => t.prismaField({
    type: "Task",
    args: {
        title: t.arg.string({
            required: true,
            validate: {
               type: "string",
               minLength: 1,
               maxLength: 100
            }
        }),
        taskListId: t.arg.string({
            required: true,
            validate: {
                schema: z.string().uuid(),
            },
        })
    },
    resolve: (query, parent, args, ctx, info) =>
        ctx.prisma.task.create({
            ...query,
            data: {
                title: args.title,
                taskListId: args.taskListId
            }
        })
}))

builder.mutationField("deleteTask", (t) => t.prismaField({
    type: "Task",
    args: {
        id: t.arg.id({
            required: true,
            validate: {
                schema: z.string().uuid(),
            },
        }),
    },
    resolve: (query, parent, args, ctx, info) =>
        ctx.prisma.task.delete({
            ...query,
            where: {
                id: args.id
            }
        })
}))
