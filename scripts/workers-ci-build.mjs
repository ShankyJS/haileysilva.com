import { execSync } from "node:child_process";

// Workers Builds installs with `npm ci`, then may run `npx wrangler preview`
// without a separate build command. Build the Vite site during that install
// so ./dist exists for the asset upload. Local npm install does not do this.
if (process.env.WORKERS_CI === "1") {
  execSync("npm run build", { stdio: "inherit" });
}
