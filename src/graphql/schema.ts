// GraphQL schema composition will live here.
import { builder } from "../builder.js";

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