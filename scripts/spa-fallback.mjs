import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "..", "dist");
const index = path.join(dist, "index.html");
if (!existsSync(index)) {
  console.error("dist/index.html is missing. Run vite build first.");
  process.exit(1);
}

copyFileSync(index, path.join(dist, "404.html"));
copyFileSync(index, path.join(dist, "200.html"));
console.log("SPA fallback: dist/404.html and dist/200.html");
