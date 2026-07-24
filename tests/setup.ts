import { execSync } from "node:child_process";
import { resolve } from "node:path";

const prismaBin = resolve(process.cwd(), "node_modules/.bin/prisma");

execSync(`${prismaBin} db push --skip-generate`, {
  stdio: "inherit",
  env: process.env,
});
