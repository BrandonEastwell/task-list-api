// GraphQL schema composition will live here.
import {builder} from "./builder";

import "./queries/taskList";
import "./queries/task";
import "./mutations/taskList";
import "./mutations/task";
import {TaskPageShape} from "./types";

builder.queryType({
    fields: () => ({}),
});

builder.mutationType({
    fields: () => ({}),
});

export const TaskType = builder.prismaObject("Task", {
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

export const TaskListType = builder.prismaObject("TaskList", {
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

export const TaskPageType = builder.objectRef<TaskPageShape>("TaskPage");
TaskPageType.implement({
    description: "A page of tasks.",
    fields: (t) => ({
        items: t.field({
            type: [TaskType],
            resolve: (page) => page.items,
        }),
        totalCount: t.exposeInt("totalCount"),
        hasNextPage: t.exposeBoolean("hasNextPage"),
        limit: t.exposeInt("limit"),
        offset: t.exposeInt("offset")
    }),
})

export const schema = builder.toSchema();
