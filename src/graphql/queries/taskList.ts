import {builder} from "../builder";
import {TaskListType} from "../schema";

builder.queryField("taskLists", (t) => t.prismaField({
    type: [TaskListType],
    description: "Return all task lists",
    resolve: async (query, root, args, ctx, info)=>
        ctx.prisma.taskList.findMany({
            ...query,
            orderBy: {
                createdAt: "asc",
            },
        }),
}));
