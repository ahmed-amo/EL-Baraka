/**
 * cPanel / Passenger entry point.
 * Runs the Next.js standalone server produced by `npm run build`.
 */
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const standaloneDir = path.join(root, ".next", "standalone");
const serverFile = path.join(standaloneDir, "server.js");

if (!fs.existsSync(serverFile)) {
  console.error("[el-baraka] Missing .next/standalone/server.js — run: npm ci && npm run build");
  process.exit(1);
}

process.env.NODE_ENV = "production";
process.env.HOSTNAME = process.env.HOSTNAME || "127.0.0.1";
if (!process.env.PORT) {
  process.env.PORT = "3000";
}

process.chdir(standaloneDir);
require(serverFile);
