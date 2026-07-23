import { createServer as createHttpServer } from "node:http";
import { createYoga } from "graphql-yoga";

export function createServer() {
  const yoga = createYoga({
    graphqlEndpoint: "/graphql",
  });

  return createHttpServer(yoga);
}
