import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ORDINALS = [
  null,
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
  "Eighth",
  "Ninth",
  "Tenth",
  "Eleventh",
  "Twelfth",
  "Thirteenth",
  "Fourteenth",
  "Fifteenth",
  "Sixteenth",
  "Seventeenth",
  "Eighteenth",
  "Nineteenth",
  "Twentieth",
];

const WORDS = [
  null,
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
  "Twenty",
];

export function expectedSchedule(startsAt) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?(Z|[+-]\d{2}:\d{2})$/.exec(startsAt);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (month < 1 || month > 12 || hour > 23 || minute > 59) return null;
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
    return null;
  }
  const suffix = hour >= 12 ? "PM" : "AM";
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  return {
    weekday: WEEKDAYS[utc.getUTCDay()],
    date: `${MONTHS[month - 1]} ${day}, ${year}`,
    time: `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`,
  };
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function requireString(errors, party, label, value) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`Party ${label}: expected a non-empty string.`);
  }
}

export function readParties(partiesDir) {
  if (!existsSync(partiesDir)) {
    throw new Error(`Parties directory not found: ${partiesDir}`);
  }
  const folders = readdirSync(partiesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => Number(a) - Number(b));

  return folders.map((folder) => {
    const file = path.join(partiesDir, folder, "party.json");
    if (!existsSync(file)) {
      throw new Error(`Missing ${file}`);
    }
    let data;
    try {
      data = JSON.parse(readFileSync(file, "utf8"));
    } catch (error) {
      throw new Error(`Could not parse ${file}: ${error.message}`);
    }
    return { folderNumber: Number(folder), file, data };
  });
}

function validateParty(party, { publicDir, seen }) {
  const errors = [];
  const { folderNumber, data } = party;
  const label = data && typeof data.number === "number" ? data.number : folderNumber;
  if (!data || typeof data !== "object") {
    return [`Party ${folderNumber}: party.json must be an object.`];
  }
  if (data.number !== folderNumber) {
    errors.push(`Party ${label}: "number" is ${data.number}, but the folder is ${folderNumber}.`);
  }
  if (seen.has(data.number)) errors.push(`Party ${label}: duplicate number.`);
  if (typeof data.number === "number") seen.add(data.number);
  if (data.status !== "current" && data.status !== "archived") {
    errors.push(`Party ${label}: status must be "current" or "archived".`);
  }

  for (const key of ["honoree", "theme", "scriptLine", "heroWord", "invitationLine", "eventTitle", "venueName", "blurb", "headImage"]) {
    requireString(errors, data, `${label} ${key}`, data[key]);
  }
  if (typeof data.heroWord === "string" && [...data.heroWord].length < 1) {
    errors.push(`Party ${label}: heroWord needs at least one character.`);
  }

  const schedule = data.schedule;
  if (!schedule || typeof schedule !== "object") {
    errors.push(`Party ${label}: schedule is missing.`);
  } else {
    requireString(errors, data, `${label} timeZone`, schedule.timeZone);
    if (typeof schedule.timeZone === "string" && schedule.timeZone.trim()) {
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: schedule.timeZone });
      } catch {
        errors.push(`Party ${label}: timeZone "${schedule.timeZone}" is not a valid IANA zone.`);
      }
    }
    if (schedule.timeNote != null && typeof schedule.timeNote !== "string") {
      errors.push(`Party ${label}: timeNote must be a string or null.`);
    }
  }

  if (!Array.isArray(data.addressLines) || data.addressLines.some((line) => typeof line !== "string" || !line.trim())) {
    errors.push(`Party ${label}: addressLines must be an array of non-empty strings.`);
  }

  for (const key of ["mapsUrl", "registryUrl", "rsvpUrl"]) {
    const value = data[key];
    if (value == null) continue;
    if (typeof value !== "string" || !isHttpUrl(value)) {
      errors.push(`Party ${label}: ${key} must be an http(s) URL or null.`);
    }
  }

  if (typeof data.headImage === "string") {
    if (!data.headImage.startsWith("/") || data.headImage.includes("..")) {
      errors.push(`Party ${label}: headImage must be an absolute site path.`);
    }
  }

  const pending = data.detailsPending === true;
  if (data.detailsPending != null && typeof data.detailsPending !== "boolean") {
    errors.push(`Party ${label}: detailsPending must be a boolean.`);
  }

  if (!pending && schedule && typeof schedule === "object") {
    if (typeof schedule.startsAt !== "string") {
      errors.push(`Party ${label}: schedule.startsAt is required.`);
    } else {
      const expected = expectedSchedule(schedule.startsAt);
      if (!expected) {
        errors.push(`Party ${label}: schedule.startsAt must be an ISO local time with an offset.`);
      } else {
        for (const key of ["weekday", "date", "time"]) {
          if (schedule[key] !== expected[key]) {
            errors.push(
              `Party ${label}: schedule.${key} is "${schedule[key]}", but startsAt says "${expected[key]}".`,
            );
          }
        }
      }
    }
    if (!Array.isArray(data.addressLines) || data.addressLines.length === 0) {
      errors.push(`Party ${label}: addressLines need the street address.`);
    }
    if (typeof data.mapsUrl !== "string") {
      errors.push(`Party ${label}: mapsUrl is required once details are final.`);
    }
    if (typeof data.headImage === "string" && data.headImage.startsWith("/") && !data.headImage.includes("..")) {
      const asset = path.join(publicDir, data.headImage);
      if (!existsSync(asset)) {
        errors.push(`Party ${label}: missing head image at ${asset}.`);
      }
    }
  }

  return errors;
}

export function validateAll({ partiesDir, publicDir }) {
  let parties;
  try {
    parties = readParties(partiesDir);
  } catch (error) {
    return { ok: false, errors: [error.message], parties: [] };
  }
  const errors = [];
  if (parties.length === 0) errors.push(`No parties found in ${partiesDir}.`);
  const currents = parties.filter((party) => party.data.status === "current");
  if (currents.length !== 1) {
    errors.push(`Expected exactly one current party, found ${currents.length}.`);
  }
  const seen = new Set();
  for (const party of parties) errors.push(...validateParty(party, { publicDir, seen }));
  return { ok: errors.length === 0, errors, parties };
}

function ordinal(number) {
  return ORDINALS[number] ?? `${number}${suffix(number)}`;
}

function word(number) {
  return WORDS[number] ?? String(number);
}

function suffix(number) {
  const teen = number % 100;
  if (teen >= 11 && teen <= 13) return "th";
  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function firstName(honoree) {
  const [name] = honoree.trim().split(/\s+/);
  return name || honoree;
}

export function scaffoldParty(previous, number, overrides = {}) {
  const schedule = previous.schedule ?? {};
  return {
    number,
    status: "current",
    honoree: previous.honoree,
    theme: overrides.theme ?? `It's Fun to Be ${word(number)}`,
    scriptLine: overrides.scriptLine ?? previous.scriptLine ?? "It's fun to be",
    heroWord: overrides.heroWord ?? word(number).toUpperCase(),
    invitationLine: previous.invitationLine ?? "Join us to celebrate",
    eventTitle: overrides.eventTitle ?? `${firstName(previous.honoree)}'s ${ordinal(number)} Birthday`,
    schedule: {
      startsAt: null,
      timeZone: schedule.timeZone ?? "America/Vancouver",
      weekday: null,
      date: null,
      time: null,
      timeNote: schedule.timeNote ?? null,
    },
    venueName: previous.venueName ?? "Our House",
    addressLines: Array.isArray(previous.addressLines) ? [...previous.addressLines] : [],
    mapsUrl: previous.mapsUrl ?? null,
    registryUrl: null,
    rsvpUrl: null,
    headImage: `/parties/${number}/hailey-head.webp`,
    blurb: "Details coming soon.",
    detailsPending: true,
  };
}

function writeJson(file, data) {
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export function archiveCurrent({ partiesDir, dryRun = false, force = false, overrides = {} }) {
  const parties = readParties(partiesDir);
  const currents = parties.filter((party) => party.data.status === "current");
  if (currents.length !== 1) {
    throw new Error(`Expected exactly one current party, found ${currents.length}.`);
  }
  const current = currents[0];
  if (current.data.detailsPending && !force) {
    throw new Error(
      `Party ${current.data.number} is still marked detailsPending. Finish it, or re-run with --force.`,
    );
  }
  const nextNumber = current.data.number + 1;
  if (parties.some((party) => party.folderNumber === nextNumber)) {
    throw new Error(`Party ${nextNumber} already exists.`);
  }
  const next = scaffoldParty(current.data, nextNumber, overrides);
  const nextDir = path.join(partiesDir, String(nextNumber));
  const nextFile = path.join(nextDir, "party.json");
  if (dryRun) {
    return { archived: current.data.number, created: nextNumber, next, wrote: false };
  }
  current.data.status = "archived";
  writeJson(current.file, current.data);
  mkdirSync(nextDir, { recursive: true });
  writeJson(nextFile, next);
  return { archived: current.data.number, created: nextNumber, next, wrote: true, nextFile };
}
