// GraphQL schema composition will live here.
import {builder} from "./builder";

builder.prismaObject("Task", {
    description: "A task belonging to a task list.",
    fields: (t) => ({
        id: t.exposeID("id"),
        title: t.exposeString("title"),
        completed: t.exposeBoolean("completed"),
        createdAt: t.expose("createdAt", {
            type: "DateTime",
        }),
        updatedAt: t.expose("updatedAt", {
            type: "DateTime",
        }),
        taskList: t.relation("taskList"),
    }),
});

builder.prismaObject("TaskList", {
    description: "A named collection of tasks.",
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        createdAt: t.expose("createdAt", {
            type: "DateTime",
        }),
        tasks: t.relation("tasks"),
    }),
});

builder.queryField("taskLists", (t) => t.prismaField({
    type: ["TaskList"],
    description: "Return all task lists",
    resolve: async (query, root, args, ctx, info)=>
        ctx.prisma.taskList.findMany({
            ...query,
            orderBy: {
                createdAt: "asc",
            },
        }),
}));

builder.queryField("tasks", (t) => t.prismaField({
    type: ["Task"],
    description: "Return tasks for a given list",
    args: {
        listId: t.arg.id({required: true}),
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
        id: t.arg.id({required: true}),
    },
    resolve: async (query, root, args, ctx, info)=>
        ctx.prisma.task.findMany({
            ...query,
            where: {
                id: args.id,
            }
        }),
}));

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
