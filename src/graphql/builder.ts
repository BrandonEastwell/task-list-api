import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import {GraphQLScalarType, Kind} from "graphql";

import PrismaTypes, {getDatamodel} from "@pothos/plugin-prisma/generated";
import {prisma} from "../db/prisma";
import {GraphQLContext} from "../context";
import ZodPlugin from "@pothos/plugin-zod";

export const builder = new SchemaBuilder<{
    Context: GraphQLContext;
    PrismaTypes: PrismaTypes; // This gives the builder all the type information about your prisma schema
    Scalars: {
        DateTime: {
            Input: Date | string;
            Output: Date;
        };
    };
}>({
    plugins: [PrismaPlugin, ZodPlugin],
    prisma: {
        client: prisma,
        dmmf: getDatamodel(),
        filterConnectionTotalCount: true,
        // warn when not using a query parameter correctly
        onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
    },
    zod: {
        validationError: (zodError, args, context, info) => {
            // the default behavior is to just throw the zod error directly
            return zodError;
        },
    }
});

builder.addScalarType("DateTime", new GraphQLScalarType({
    name: "DateTime",
    serialize(value: unknown): string {
        return value instanceof Date ? value.toISOString() : new Date(value as string).toISOString();
    },
    parseValue(value: unknown): Date {
        return value instanceof Date ? value : new Date(value as string);
    },
    parseLiteral(ast): Date | null {
        if (ast.kind !== Kind.STRING) {
            return null;
        }

        return new Date(ast.value);
    },
}));
