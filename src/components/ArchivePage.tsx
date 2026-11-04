import { Link, useParams } from "react-router-dom";
import { keepsakes, type Keepsake } from "../keepsakes";
import { getCurrentParty, getPartyByNumber, parties } from "../parties";
import type { Party } from "../types";
import { usePageTitle } from "../usePageTitle";
import { NotFoundPage } from "./NotFoundPage";
import { PartyPage } from "./PartyPage";
import { Frame } from "./SiteChrome";

function partyKind(party: Party): string {
  if (party.number === 1) return "First birthday";
  return party.eventTitle;
}

function partyWhen(party: Party): string {
  const { weekday, date, time } = party.schedule;
  if (weekday && date && time) return `${weekday}, ${date}`;
  return "Date to be announced";
}

function letters(): Keepsake[] {
  const birthdays: Keepsake[] = [...parties]
    .sort((a, b) => a.number - b.number)
    .map((party) => ({
      id: `party-${party.number}`,
      kind: partyKind(party),
      title: party.theme,
      when: partyWhen(party),
      href: party.status === "current" ? "/" : `/archive/${party.number}`,
      label: party.status === "current" ? "This year's party" : "Look back",
      external: false,
    }));
  return [...keepsakes, ...birthdays];
}

function LetterCard({ letter }: { letter: Keepsake }) {
  const body = (
    <>
      <span className="letter-kind">{letter.kind}</span>
      <span className="letter-title">{letter.title}</span>
      <span className="letter-when">{letter.when}</span>
      <span className="letter-label">
        {letter.label}
        {letter.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </span>
    </>
  );

  if (letter.external) {
    return (
      <a className="letter" href={letter.href} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    );
  }

  return (
    <Link className="letter" to={letter.href}>
      {body}
    </Link>
  );
}

export function ArchiveIndexPage() {
  const current = getCurrentParty();
  usePageTitle(`Past parties · ${current.honoree}`);

  return (
    <Frame>
      <main id="content" className="archive-main">
        <p className="kicker">The shelf</p>
        <h1 className="archive-heading">Past parties</h1>
        <ul className="letters">
          {letters().map((letter) => (
            <li key={letter.id}>
              <LetterCard letter={letter} />
            </li>
          ))}
        </ul>
      </main>
    </Frame>
  );
}

export function ArchivedPartyPage() {
  const params = useParams();
  const parsed = Number(params.number);
  if (!Number.isInteger(parsed) || parsed < 1) return <NotFoundPage />;
  const party = getPartyByNumber(parsed);
  if (!party) return <NotFoundPage />;
  if (party.status === "current") return <CurrentPartyNotice theme={party.theme} />;
  return <PartyPage party={party} archived />;
}

function CurrentPartyNotice({ theme }: { theme: string }) {
  const { honoree } = getCurrentParty();
  usePageTitle(`This year's party · ${honoree}`);
  return (
    <Frame>
      <main id="content" className="archive-main">
        <p className="kicker">Still on the front page</p>
        <h1 className="archive-heading">This birthday is on the home page</h1>
        <p className="notice-copy">
          {theme} is the party we're celebrating now. It stays here until the next one begins.
        </p>
        <Link className="btn" to="/">
          Open this year's party
        </Link>
      </main>
    </Frame>
  );
}
