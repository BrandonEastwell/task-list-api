import {prisma} from "./db/prisma";
import {PrismaClient} from "@prisma/client";

export interface GraphQLContext {
    prisma: PrismaClient;
}

export function createContext(): GraphQLContext {
    return {
        prisma,
    };
}