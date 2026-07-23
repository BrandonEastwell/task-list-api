import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";

import PrismaTypes, {getDatamodel} from "@pothos/plugin-prisma/generated";
import {prisma} from "../db/prisma";

const builder = new SchemaBuilder<{
    PrismaTypes: PrismaTypes; // This gives the builder all the type information about your prisma schema
}>({
    plugins: [PrismaPlugin],
    prisma: {
        client: prisma,
        dmmf: getDatamodel(),
        filterConnectionTotalCount: true,
        // warn when not using a query parameter correctly
        onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
    },
});