import path from "node:path";
import { archiveCurrent } from "./parties.mjs";

const args = process.argv.slice(2);

function flag(name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} needs a value.`);
  }
  return value;
}

const overrides = {};
const theme = flag("--theme");
const eventTitle = flag("--event-title");
const heroWord = flag("--hero-word");
const scriptLine = flag("--script-line");
if (theme) overrides.theme = theme;
if (eventTitle) overrides.eventTitle = eventTitle;
if (heroWord) overrides.heroWord = heroWord;
if (scriptLine) overrides.scriptLine = scriptLine;

const root = path.resolve(import.meta.dirname, "..");
const result = archiveCurrent({
  partiesDir: path.join(root, "src", "parties"),
  dryRun: args.includes("--dry-run"),
  force: args.includes("--force"),
  overrides,
});

if (result.wrote) {
  console.log(`Archived party ${result.archived}. It now lives at /archive/${result.archived}.`);
  console.log(`Started party ${result.created}: ${result.nextFile}`);
  console.log("Next:");
  console.log(`  1. Edit src/parties/${result.created}/party.json (date, address, registry, rsvpUrl).`);
  console.log(`  2. Add the cutout at public${result.next.headImage}`);
  console.log("  3. Remove detailsPending, or set it to false, once the details are final.");
  console.log("  4. npm run dev");
} else {
  console.log(`Dry run. Would archive party ${result.archived} and create party ${result.created}.`);
  console.log(JSON.stringify(result.next, null, 2));
}
