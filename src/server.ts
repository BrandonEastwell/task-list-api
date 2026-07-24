import { createServer as createHttpServer } from "node:http";
import { createYoga } from "graphql-yoga";
import {schema} from "./graphql/schema";
import {createContext} from "./context";

export const yoga = createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: "/graphql",
  maskedErrors: false,
});

export function createServer() {
  return createHttpServer(yoga);
}
