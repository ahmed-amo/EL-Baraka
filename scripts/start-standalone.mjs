import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), ".next", "standalone");
const server = join(dir, "server.js");

if (!existsSync(server)) {
  console.error("Missing standalone build. Run npm run build first.");
  process.exit(1);
}

process.env.HOSTNAME ||= "0.0.0.0";

const child = spawn(process.execPath, ["server.js"], {
  cwd: dir,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
