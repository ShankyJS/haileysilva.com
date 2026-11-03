export type PartyStatus = "current" | "archived";

export type PartySchedule = {
  /** Local wall-clock start, including the UTC offset. Null while details are pending. */
  startsAt: string | null;
  /** IANA zone for where the party happens, e.g. America/Vancouver. */
  timeZone: string;
  weekday: string | null;
  date: string | null;
  time: string | null;
  /** Short zone label shown under the time, e.g. "Pacific time". */
  timeNote: string | null;
};

/**
 * One birthday. The shape is checked by scripts/parties.mjs before every build.
 * Drop the next Google Form into `rsvpUrl` when it is ready.
 */
export type Party = {
  number: number;
  status: PartyStatus;
  honoree: string;
  theme: string;
  scriptLine: string;
  /** First letter is drawn as the portrait. "ONE" shows the face, then NE. */
  heroWord: string;
  invitationLine: string;
  eventTitle: string;
  schedule: PartySchedule;
  venueName: string;
  addressLines: string[];
  mapsUrl: string | null;
  registryUrl: string | null;
  /** Google Form URL. Null keeps the RSVP placeholder on the page. */
  rsvpUrl: string | null;
  headImage: string;
  blurb: string;
  detailsPending?: boolean;
};
