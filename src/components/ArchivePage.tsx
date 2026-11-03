import { Link, useParams } from "react-router-dom";
import { getArchivedParties, getCurrentParty, getPartyByNumber } from "../parties";
import { usePageTitle } from "../usePageTitle";
import { FaceWithHat } from "./FaceWithHat";
import { NotFoundPage } from "./NotFoundPage";
import { PartyPage } from "./PartyPage";
import { Frame } from "./SiteChrome";

export function ArchiveIndexPage() {
  const current = getCurrentParty();
  const archived = getArchivedParties();
  usePageTitle(`Past parties · ${current.honoree}`);

  return (
    <Frame>
      <main id="content" className="archive-main">
        <p className="kicker">The shelf</p>
        <h1 className="archive-heading">Past parties</h1>
        {archived.length === 0 ? (
          <div className="empty-archive">
            <FaceWithHat src={current.headImage} name={current.honoree} />
            <p>
              {current.eventTitle} is still the party we're celebrating. When the next one begins, this page will keep
              the earlier birthdays.
            </p>
            <Link className="btn" to="/">
              Go to this year's party
            </Link>
          </div>
        ) : (
          <div className="archive-list">
            {archived.map((party) => (
              <Link className="archive-card" key={party.number} to={`/archive/${party.number}`}>
                <FaceWithHat src={party.headImage} name={party.honoree} />
                <span className="archive-card-copy">
                  <span className="archive-kicker">Party {party.number}</span>
                  <span className="archive-title">{party.theme}</span>
                  <span className="archive-when">
                    {party.schedule.weekday && party.schedule.date && party.schedule.time
                      ? `${party.schedule.weekday}, ${party.schedule.date} · ${party.schedule.time}`
                      : "Date to be announced"}
                  </span>
                  <span className="archive-blurb">{party.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
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
  if (party.status === "current") return <CurrentPartyNotice partyNumber={party.number} theme={party.theme} />;
  return <PartyPage party={party} archived />;
}

function CurrentPartyNotice({ partyNumber, theme }: { partyNumber: number; theme: string }) {
  const { honoree } = getCurrentParty();
  usePageTitle(`Party ${partyNumber} · ${honoree}`);
  return (
    <Frame>
      <main id="content" className="archive-main">
        <p className="kicker">Still on the front page</p>
        <h1 className="archive-heading">Party no. {partyNumber} is the current celebration</h1>
        <p className="notice-copy">
          {theme} lives on the home page for now. When the next birthday is ready, this address keeps the party just as
          it was.
        </p>
        <Link className="btn" to="/">
          Open this year's party
        </Link>
      </main>
    </Frame>
  );
}
