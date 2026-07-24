import {builder} from "../builder";

builder.mutationField("addTaskList", (t) => t.prismaField({
    type: "TaskList",
    args: {
        name: t.arg.string({
            required: true,
            description: "The task list name",
            validate: {
                type: "string",
                minLength: 1,
                maxLength: 100
            }
        })
    },
    resolve: (query, parent, args, ctx, info) =>
        ctx.prisma.taskList.create({
            ...query,
            data: {
                name: args.name,
                createdAt: new Date(),
            }
        })
}));
