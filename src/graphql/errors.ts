import { GraphQLError } from "graphql";

export type ErrorCode =
    | "BAD_USER_INPUT"
    | "NOT_FOUND"
    | "INTERNAL_SERVER_ERROR";

class AppError extends GraphQLError {
    constructor(message: string, code: ErrorCode) {
        super(message, {
            extensions: {
                code,
            },
        });
    }
}

export function notFound(entity: string): AppError {
    return new AppError(`${entity} was not found.`, "NOT_FOUND");
}

export function badUserInput(message: string): AppError {
    return new AppError(message, "BAD_USER_INPUT");
}