import { createServer } from "./server";

async function main(): Promise<void> {
  const server = createServer();
  const port = Number(process.env.PORT ?? 4000);

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}/graphql`);
  });
}

void main();
