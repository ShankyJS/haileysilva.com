import { Link } from "react-router-dom";
import type { Party } from "../types";
import { usePageTitle } from "../usePageTitle";
import { Balloons } from "./Decorations";
import { FaceWithHat } from "./FaceWithHat";
import { Garland } from "./Garland";
import { Frame } from "./SiteChrome";

function HeartRule() {
  return (
    <div className="rule" aria-hidden="true">
      <span />
      <svg viewBox="0 0 24 22" width="22" height="20">
        <path
          fill="#EE82AA"
          d="M12 20s-6.8-4.2-9-8.2C1.4 8.8 2.6 5.6 5.6 5.4c1.8-.1 3 .9 3.6 2.1C9.9 6.3 11.2 5.2 13 5.4c3 .3 4.2 3.4 2.6 6.4C18.8 15.8 12 20 12 20z"
        />
      </svg>
      <span />
    </div>
  );
}

function Schedule({ party }: { party: Party }) {
  const { schedule } = party;
  if (!schedule.weekday || !schedule.date || !schedule.time) {
    return <p className="when tba">Date to be announced</p>;
  }
  return (
    <>
      <p className="when">
        <span className="when-part">
          <span className="diamond" aria-hidden="true" />
          {schedule.weekday}
        </span>
        <span className="when-part">
          <span className="sep" aria-hidden="true">
            |
          </span>
          {schedule.date}
        </span>
        <time className="when-part" dateTime={schedule.startsAt ?? undefined}>
          <span className="sep" aria-hidden="true">
            |
          </span>
          {schedule.time}
        </time>
      </p>
      {schedule.timeNote ? <p className="time-note">{schedule.timeNote}</p> : null}
    </>
  );
}

function Registry({ party }: { party: Party }) {
  return (
    <section className="card registry-card" id="registry" aria-labelledby="registry-heading">
      <h2 id="registry-heading">Gift registry</h2>
      {party.registryUrl ? (
        <>
          <p>A little something, if you'd like to bring a gift.</p>
          <a className="btn" href={party.registryUrl} target="_blank" rel="noopener noreferrer">
            View the gift registry
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </>
      ) : (
        <p>The registry link will go here.</p>
      )}
    </section>
  );
}

function Rsvp({ party, archived }: { party: Party; archived: boolean }) {
  if (party.rsvpUrl) {
    return (
      <section className="card rsvp-card" id="rsvp" aria-labelledby="rsvp-heading" data-rsvp="open">
        <h2 id="rsvp-heading">RSVP</h2>
        <p>Let us know you're coming.</p>
        <a className="btn" href={party.rsvpUrl} target="_blank" rel="noopener noreferrer">
          Open the RSVP form
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </section>
    );
  }

  if (archived) {
    return (
      <section className="card rsvp-card" id="rsvp" aria-labelledby="rsvp-heading" data-rsvp="closed">
        <h2 id="rsvp-heading">RSVP</h2>
        <p>This party has already happened, so the RSVP form is closed.</p>
      </section>
    );
  }

  return (
    <section className="card rsvp-card" id="rsvp" aria-labelledby="rsvp-heading" data-rsvp="placeholder">
      <h2 id="rsvp-heading">RSVP</h2>
      <p>The Google Form isn't up yet. This is where the link will go, so you can tell us you're coming.</p>
      <p className="soon-pill">RSVP coming soon</p>
    </section>
  );
}

export function PartyPage({ party, archived = false }: { party: Party; archived?: boolean }) {
  usePageTitle(`${party.theme} · ${party.honoree}`);
  const rest = [...party.heroWord].slice(1).join("");

  return (
    <Frame>
      <main id="content">
        {archived ? (
          <p className="archive-note">
            Past party
            <span aria-hidden="true"> · </span>
            <Link to="/archive">All past parties</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/">This year's party</Link>
          </p>
        ) : null}
        {party.detailsPending ? (
          <p className="pending-note">Details for this party are still being filled in.</p>
        ) : null}
        <Garland src={party.headImage} name={party.honoree} />
        <div className="hero">
          <h1 className="hero-title">
            <span className="sr-only">
              {party.scriptLine} {party.heroWord}
            </span>
            <span className="hero-visual" aria-hidden="true">
              <span className="hero-face">
                <FaceWithHat src={party.headImage} name={party.honoree} priority />
              </span>
              <span className="hero-words">
                <span className="script-line">{party.scriptLine}</span>
                {rest ? (
                  <span className="hero-letters">
                    {[...rest].map((character, index, all) => (
                      <span key={`${character}${index}`} className={index === all.length - 1 ? "is-last" : undefined}>
                        {character}
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            </span>
          </h1>
          <Balloons />
        </div>
        <section className="details" aria-labelledby="event-title">
          <p className="kicker">{party.invitationLine}</p>
          <h2 id="event-title" className="event-title">
            {party.eventTitle}
          </h2>
          <HeartRule />
          <Schedule party={party} />
          <p className="venue">{party.venueName}</p>
          {party.addressLines.length > 0 ? (
            <address>
              {party.mapsUrl ? (
                <a className="address-link" href={party.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {party.addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                  <span className="maps-cue">
                    Open in Google Maps
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              ) : (
                <span className="address-link">
                  {party.addressLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              )}
            </address>
          ) : (
            <p className="when tba">Address to be announced</p>
          )}
        </section>
        <div className="actions">
          <Registry party={party} />
          <Rsvp party={party} archived={archived} />
        </div>
        <p className="party-no">Party no. {party.number}</p>
      </main>
    </Frame>
  );
}
