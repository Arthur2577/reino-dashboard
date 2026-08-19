import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const standaloneDir = join(process.cwd(), ".next", "standalone");

if (!existsSync(standaloneDir)) {
  throw new Error("Next standalone output was not generated.");
}

for (const [source, destination] of [
  ["public", join(standaloneDir, "public")],
  [join(".next", "static"), join(standaloneDir, ".next", "static")],
]) {
  if (existsSync(source)) {
    mkdirSync(destination, { recursive: true });
    cpSync(source, destination, { recursive: true });
  }
}
