import path from "node:path";
import { validateAll } from "./parties.mjs";

const root = path.resolve(import.meta.dirname, "..");
const result = validateAll({
  partiesDir: path.join(root, "src", "parties"),
  publicDir: path.join(root, "public"),
});

if (!result.ok) {
  console.error("Party check failed:");
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}

const current = result.parties.find((party) => party.data.status === "current");
console.log(`Party check ok (${result.parties.length} party, current is no. ${current.data.number}).`);
