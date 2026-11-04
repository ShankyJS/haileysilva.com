import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getCurrentParty } from "../parties";
import { Decorations } from "./Decorations";
import { ScallopFrame } from "./ScallopFrame";

export function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="stage">
      <ScallopFrame>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <Decorations />
        <SiteHeader />
        {children}
        <SiteFooter />
      </ScallopFrame>
    </div>
  );
}

export function SiteHeader() {
  const { honoree } = getCurrentParty();
  return (
    <header className="site-header">
      <Link className="wordmark" to="/">
        {honoree}
      </Link>
      <nav className="site-nav" aria-label="Pages">
        <Link to={{ pathname: "/", hash: "rsvp" }}>RSVP</Link>
        <Link to={{ pathname: "/", hash: "registry" }}>Registry</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { honoree } = getCurrentParty();
  return (
    <footer className="site-footer">
      <p>{honoree}</p>
      <p>
        <Link to={{ pathname: "/", hash: "rsvp" }}>RSVP</Link>
      </p>
    </footer>
  );
}
