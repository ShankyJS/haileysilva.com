import type { Party } from "../types";

const modules = import.meta.glob("./*/party.json", {
  eager: true,
  import: "default",
}) as Record<string, Party>;

export const parties: Party[] = Object.values(modules).sort((a, b) => a.number - b.number);

export function getCurrentParty(): Party {
  const current = parties.filter((party) => party.status === "current");
  if (current.length !== 1) {
    throw new Error(`Expected one current party, found ${current.length}. Run npm run validate.`);
  }
  return current[0];
}

export function getArchivedParties(): Party[] {
  return parties.filter((party) => party.status === "archived").sort((a, b) => b.number - a.number);
}

export function getPartyByNumber(number: number): Party | undefined {
  return parties.find((party) => party.number === number);
}
