import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { archiveCurrent, expectedSchedule, validateAll } from "./parties.mjs";

const root = path.resolve(import.meta.dirname, "..");

function sampleParty(number, status) {
  return {
    number,
    status,
    honoree: "Hailey Silva",
    theme: "It's Fun to Be One",
    scriptLine: "It's fun to be",
    heroWord: "ONE",
    invitationLine: "Join us to celebrate",
    eventTitle: "Hailey's First Birthday",
    schedule: {
      startsAt: "2026-11-21T15:00:00-07:00",
      timeZone: "America/Vancouver",
      weekday: "Saturday",
      date: "November 21, 2026",
      time: "3:00 PM",
      timeNote: "Pacific time",
    },
    venueName: "Our House",
    addressLines: ["24951 112 Ave, Unit #122", "Maple Ridge, BC V2W 0L1"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=home",
    registryUrl: "https://getjoybox.com/registry/example",
    rsvpUrl: null,
    headImage: `/parties/${number}/hailey-head.webp`,
    blurb: "Her first birthday.",
  };
}

test("wall-clock schedule matches the invite", () => {
  assert.deepEqual(expectedSchedule("2026-11-21T15:00:00-07:00"), {
    weekday: "Saturday",
    date: "November 21, 2026",
    time: "3:00 PM",
  });
  assert.equal(expectedSchedule("2026-11-21T15:00:00-08:00").time, "3:00 PM");
  assert.equal(expectedSchedule("not-a-date"), null);
});

test("the shipped party validates", () => {
  const result = validateAll({
    partiesDir: path.join(root, "src", "parties"),
    publicDir: path.join(root, "public"),
  });
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.equal(result.parties.length, 1);
  assert.equal(result.parties[0].data.status, "current");
  assert.equal(result.parties[0].data.rsvpUrl, null);
});

test("archive moves the current party and scaffolds the next one", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "hailey-parties-"));
  const partiesDir = path.join(dir, "parties");
  const publicDir = path.join(dir, "public");
  await mkdir(path.join(partiesDir, "1"), { recursive: true });
  await mkdir(path.join(publicDir, "parties", "1"), { recursive: true });
  await writeFile(path.join(partiesDir, "1", "party.json"), `${JSON.stringify(sampleParty(1, "current"), null, 2)}\n`);
  await writeFile(path.join(publicDir, "parties", "1", "hailey-head.webp"), "image");

  const before = validateAll({ partiesDir, publicDir });
  assert.equal(before.ok, true, before.errors.join("\n"));

  const dry = archiveCurrent({ partiesDir, dryRun: true });
  assert.equal(dry.wrote, false);
  assert.equal(JSON.parse(await readFile(path.join(partiesDir, "1", "party.json"), "utf8")).status, "current");

  const archived = archiveCurrent({ partiesDir });
  assert.equal(archived.archived, 1);
  assert.equal(archived.created, 2);
  assert.equal(archived.next.heroWord, "TWO");
  assert.equal(archived.next.eventTitle, "Hailey's Second Birthday");
  assert.equal(archived.next.detailsPending, true);
  assert.equal(archived.next.rsvpUrl, null);
  assert.equal(archived.next.registryUrl, null);
  assert.equal(archived.next.schedule.startsAt, null);
  assert.equal(archived.next.headImage, "/parties/2/hailey-head.webp");

  const partyOne = JSON.parse(await readFile(path.join(partiesDir, "1", "party.json"), "utf8"));
  assert.equal(partyOne.status, "archived");
  assert.equal(partyOne.schedule.time, "3:00 PM");

  const after = validateAll({ partiesDir, publicDir });
  assert.equal(after.ok, true, after.errors.join("\n"));
  assert.equal(after.parties.filter((party) => party.data.status === "current").length, 1);

  assert.throws(() => archiveCurrent({ partiesDir }), /detailsPending/);
  await rm(dir, { recursive: true, force: true });
});

test("a mismatched clock line fails validation", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "hailey-bad-"));
  const partiesDir = path.join(dir, "parties");
  const publicDir = path.join(dir, "public");
  await mkdir(path.join(partiesDir, "1"), { recursive: true });
  await mkdir(path.join(publicDir, "parties", "1"), { recursive: true });
  const bad = sampleParty(1, "current");
  bad.schedule.time = "4:00 PM";
  await writeFile(path.join(partiesDir, "1", "party.json"), JSON.stringify(bad));
  await writeFile(path.join(publicDir, "parties", "1", "hailey-head.webp"), "image");
  const result = validateAll({ partiesDir, publicDir });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /schedule.time/);
  await rm(dir, { recursive: true, force: true });
});
