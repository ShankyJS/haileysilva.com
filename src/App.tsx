import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ArchiveIndexPage, ArchivedPartyPage } from "./components/ArchivePage";
import { NotFoundPage } from "./components/NotFoundPage";
import { PartyPage } from "./components/PartyPage";
import { getCurrentParty } from "./parties";

function ScrollManager() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.length > 1 && location.pathname.endsWith("/")) {
      navigate(location.pathname.replace(/\/+$/, "") + location.search + location.hash, { replace: true });
      return;
    }
    if (location.hash && /^#[A-Za-z][\w-]*$/.test(location.hash)) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location, navigate]);

  return null;
}

function CurrentParty() {
  return <PartyPage party={getCurrentParty()} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<CurrentParty />} />
        <Route path="/archive" element={<ArchiveIndexPage />} />
        <Route path="/archive/:number" element={<ArchivedPartyPage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
