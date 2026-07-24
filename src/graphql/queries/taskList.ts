import {builder} from "../builder";

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
