import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";

import type PrismaTypes from "../generated/pothos-types.js";
import type { GraphQLContext } from "../context.js";
import { prisma } from "../prisma.js";

export const builder = new SchemaBuilder<{
    Context: GraphQLContext;
    PrismaTypes: PrismaTypes;
}>({
    plugins: [PrismaPlugin],
    prisma: {
        client: prisma,
    },
});