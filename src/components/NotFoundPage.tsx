import { Link } from "react-router-dom";
import { usePageTitle } from "../usePageTitle";
import { Frame } from "./SiteChrome";

export function NotFoundPage() {
  usePageTitle("Page not found · Hailey Silva");
  return (
    <Frame>
      <main id="content" className="archive-main">
        <p className="kicker">Lost the balloon</p>
        <h1 className="archive-heading">That page isn't here</h1>
        <p className="notice-copy">The party is on the home page.</p>
        <div className="notice-actions">
          <Link className="btn" to="/">
            This year's party
          </Link>
        </div>
      </main>
    </Frame>
  );
}
