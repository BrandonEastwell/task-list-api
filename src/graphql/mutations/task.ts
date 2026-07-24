import {builder} from "../builder";
import type {Prisma} from "@prisma/client";
import {taskTitleSchema, uuidSchema} from "../validation/schema";
import {notFound} from "../errors";
import {TaskType} from "../schema";

builder.mutationField("addTask", (t) => t.prismaField({
    type: TaskType,
    args: {
        title: t.arg.string({
            required: true,
            validate: {
               schema: taskTitleSchema
            }
        }),
        taskListId: t.arg.string({
            required: true,
            validate: {
                schema: uuidSchema,
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
    type: TaskType,
    args: {
        id: t.arg.id({
            required: true,
            validate: {
                schema: uuidSchema,
            },
        }),
    },
    resolve: async (query, parent, args, ctx, info) => {
        const exists = await ctx.prisma.task.findUnique({
            where: { id: args.id }
        });

        if (!exists) throw notFound("Task");

        return ctx.prisma.task.delete({
            ...query,
            where: {
                id: args.id
            }
        })
    }
}))

builder.mutationField("updateTask", (t) => t.prismaField({
    type: TaskType,
    args: {
        id: t.arg.id({
            required: true,
            validate: {
                schema: uuidSchema,
            },
        }),
        title: t.arg.string({
            required: false,
            validate: {
                schema: taskTitleSchema
            }
        }),
        completed: t.arg.boolean({
            required: false
        })
    },
    validate: [(args) => args.title != null || args.completed != null, {
        message: "At least one of title or completed must be provided"
    }],
    resolve: async (query, parent, args, ctx, info) => {
        const data: Prisma.TaskUpdateInput = {};

        if (args.title != null) {
            data.title = args.title;
        }

        if (args.completed != null) {
            data.completed = args.completed;
        }

        const exists = await ctx.prisma.task.findUnique({
            where: { id: args.id }
        });

        if (!exists) throw notFound("Task");

        return ctx.prisma.task.update({
            ...query,
            where: { id: args.id },
            data,
        })
    }
}))
