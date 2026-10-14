import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { RELEASES_URL, REPO_URL } from "@/lib/release";

import appCss from "../index.css?url";

// ponytail: hard-coded production origin for absolute Open Graph URLs; change it if the domain changes.
export const SITE_URL = "https://filex-website.vercel.app";
const TITLE = "Filex: a fast, native file explorer";
const DESCRIPTION =
  "A native file explorer for Windows, macOS and Linux. Huge folders open without lag, and search covers every filename on your drives as you type.";

const navLink = "text-sm text-muted transition hover:text-text";

/** Feeds the pointer position to the hovered .card so its spotlight follows the cursor. */
const useCardSpotlight = () => {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const card =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(".card")
          : null;
      if (!card) {
        return;
      }
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--y", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
};

const RootDocument = () => {
  useCardSpotlight();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="focus:bg-panel sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:p-2"
        >
          Skip to content
        </a>
        <header className="border-line bg-bg/70 sticky top-0 z-40 border-b backdrop-blur-xl backdrop-saturate-150">
          <nav
            className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6"
            aria-label="Main"
          >
            <Link
              to="/"
              className="mr-auto flex items-center gap-2 font-semibold"
            >
              <img src="/favicon.svg" alt="" width="24" height="21" />
              Filex
            </Link>
            <Link
              to="/"
              hash="features"
              className={`${navLink} hidden sm:inline`}
            >
              Features
            </Link>
            <Link to="/privacy" className={navLink}>
              Privacy
            </Link>
            <a href={REPO_URL} className={navLink}>
              GitHub
            </a>
            <Link
              to="/download"
              className="bg-text text-bg rounded-md px-3 py-1.5 text-sm font-semibold transition hover:bg-white/85"
            >
              Get Filex
            </Link>
          </nav>
        </header>
        <div id="main">
          <Outlet />
        </div>
        <footer className="border-line border-t">
          <div className="text-muted mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm sm:flex-row sm:items-center">
            <p className="mr-auto">
              Filex is open source, dual-licensed MIT / Apache-2.0.
            </p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
              <a href={REPO_URL} className="hover:text-text">
                GitHub
              </a>
              <a href={RELEASES_URL} className="hover:text-text">
                Releases
              </a>
              <a
                href={`${REPO_URL}/blob/main/LICENSE-MIT`}
                className="hover:text-text"
              >
                MIT licence
              </a>
              <a
                href={`${REPO_URL}/blob/main/LICENSE-APACHE`}
                className="hover:text-text"
              >
                Apache-2.0 licence
              </a>
              <Link to="/privacy" className="hover:text-text">
                Privacy
              </Link>
            </nav>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  );
};

export const Route = createRootRoute({
  component: RootDocument,
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      {
        as: "font",
        crossOrigin: "anonymous",
        href: "/fonts/Inter-Regular.woff2",
        rel: "preload",
        type: "font/woff2",
      },
      { href: "/favicon.svg", rel: "icon", type: "image/svg+xml" },
      { href: "/favicon.ico", rel: "icon", sizes: "any" },
      { href: "/filex.png", rel: "apple-touch-icon" },
    ],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: TITLE },
      { content: DESCRIPTION, name: "description" },
      { content: "#0c0e11", name: "theme-color" },
      { content: "website", property: "og:type" },
      { content: "Filex", property: "og:site_name" },
      { content: TITLE, property: "og:title" },
      { content: DESCRIPTION, property: "og:description" },
      { content: SITE_URL, property: "og:url" },
      // ponytail: square app icon until a 1200×630 /og.png exists; then switch twitter:card to summary_large_image.
      { content: `${SITE_URL}/filex.png`, property: "og:image" },
      { content: "Filex logo", property: "og:image:alt" },
      { content: "summary", name: "twitter:card" },
      { content: TITLE, name: "twitter:title" },
      { content: DESCRIPTION, name: "twitter:description" },
      { content: `${SITE_URL}/filex.png`, name: "twitter:image" },
    ],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted mt-4">
        <Link to="/" className="text-accent underline underline-offset-2">
          Back to the home page
        </Link>
      </p>
    </main>
  ),
});
