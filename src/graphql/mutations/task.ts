import {builder} from "../builder";
import type {Prisma} from "@prisma/client";
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

builder.mutationField("updateTask", (t) => t.prismaField({
    type: "Task",
    args: {
        id: t.arg.id({
            required: true,
            validate: {
                schema: z.string().uuid("id must be a valid UUID"),
            },
        }),
        title: t.arg.string({
            required: false,
            validate: {
                type: "string",
                minLength: 1,
                maxLength: 100
            }
        }),
        completed: t.arg.boolean({
            required: false
        })
    },
    validate: [(args) => args.title != null || args.completed != null, {
        message: "At least one of title or completed must be provided"
    }],
    resolve: (query, parent, args, ctx, info) => {
        const data: Prisma.TaskUpdateInput = {};

        if (args.title != null) {
            data.title = args.title;
        }

        if (args.completed != null) {
            data.completed = args.completed;
        }

        return ctx.prisma.task.update({
            ...query,
            where: { id: args.id },
            data,
        })
    }

}))
