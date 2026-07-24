import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/task_list?schema=public";

export default defineConfig({
  resolve: {
    alias: {
      "@pothos/plugin-prisma/generated": resolve(process.cwd(), "lib/generated/pothos-prisma-types.ts"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    coverage: {
      provider: "v8",
    },
  },
});
