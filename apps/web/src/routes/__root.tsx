import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/folder";
import { RELEASES_URL, REPO_URL } from "@/lib/release";

import appCss from "../index.css?url";

// ponytail: hard-coded production origin for absolute Open Graph URLs; change it if the domain changes.
export const SITE_URL = "https://filex-website.vercel.app";
const TITLE = "Filex: a fast, native file explorer";
const DESCRIPTION =
  "A native file explorer for Windows, macOS and Linux. Huge folders open without lag, and search covers every filename on your drives as you type.";

const navLink = "hidden transition-colors hover:text-accent sm:inline";

// The three logo layers sit apart and settle into the mark as the footer arrives.
const LOGO_LAYERS = [
  { from: "translateY(-10%)", name: "back" },
  { from: "translateY(14%)", name: "front" },
  { from: "scale(0.7) rotate(-10deg)", name: "mark" },
] as const;

const PHOTO_CREDIT =
  "https://commons.wikimedia.org/wiki/File:Iceland_-_2017-02-22_-_Gullfoss_-_3684.jpg";

const RootDocument = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks scripting as available before paint, so entrance states never hide content without JS. */}
        <script>{"document.documentElement.classList.add('js')"}</script>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="focus:bg-panel sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:p-2"
        >
          Skip to content
        </a>
        <header className="frame">
          <nav className="flex h-[72px] items-center gap-8" aria-label="Main">
            <Link
              to="/"
              className="text-lead mr-auto flex items-center gap-2.5 font-medium"
            >
              <img src="/favicon.svg" alt="" width="30" height="26" />
              Filex
            </Link>
            <Link to="/" hash="features" className={navLink}>
              Features
            </Link>
            <Link to="/" hash="install" className={navLink}>
              Install
            </Link>
            <Link to="/privacy" className={navLink}>
              Privacy
            </Link>
            <a href={REPO_URL} className="hover:text-accent transition-colors">
              GitHub
            </a>
          </nav>
        </header>
        <div id="main">
          <Outlet />
        </div>
        <footer className="frame bg-panel overflow-hidden pt-[clamp(48px,6vw,96px)] pb-10 [--mark-size:min(31vw,600px)]">
          {/* The mark, built large: the logo's three layers beside the name at full width. */}
          <div
            className="flex items-baseline gap-[0.08em] text-[length:var(--mark-size)] leading-none"
            data-reveal
            aria-hidden="true"
          >
            <div className="relative aspect-[700/601] h-[0.72em] shrink-0">
              {LOGO_LAYERS.map(({ name, from }) => (
                <img
                  key={name}
                  src={`/logo/${name}.svg`}
                  alt=""
                  width="350"
                  height="300"
                  loading="lazy"
                  className="logo-layer absolute inset-0 h-full w-full"
                  style={{ "--from": from } as CSSProperties}
                />
              ))}
            </div>
            <p className="-mb-[0.2em] font-medium tracking-[-0.05em]">Filex</p>
          </div>
          <div className="mt-14 grid gap-8 text-[15px] sm:grid-cols-2 lg:grid-cols-12">
            <nav
              className="flex flex-col gap-2 lg:col-span-3"
              aria-label="Footer"
            >
              <Link to="/download" className="hover:text-accent">
                Download
              </Link>
              <a href={RELEASES_URL} className="hover:text-accent">
                Releases
              </a>
              <a href={REPO_URL} className="hover:text-accent">
                GitHub
              </a>
              <Link to="/privacy" className="hover:text-accent">
                Privacy
              </Link>
            </nav>
            <div className="flex flex-col gap-2 lg:col-span-3">
              <a
                href={`${REPO_URL}/blob/main/LICENSE-MIT`}
                className="hover:text-accent"
              >
                MIT licence
              </a>
              <a
                href={`${REPO_URL}/blob/main/LICENSE-APACHE`}
                className="hover:text-accent"
              >
                Apache-2.0 licence
              </a>
            </div>
            <p className="text-muted lg:col-span-5 lg:col-start-8">
              Filex is open source, dual-licensed MIT / Apache-2.0. Preview
              photo:{" "}
              <a
                href={PHOTO_CREDIT}
                className="hover:text-accent underline underline-offset-2"
              >
                &ldquo;Gullfoss&rdquo; by Pierre-Selim Huard
              </a>
              , CC BY 4.0, via Wikimedia Commons.
            </p>
          </div>
        </footer>
        <Reveal key={pathname} />
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
        href: "/fonts/Roundo-500.woff2",
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
      { content: "#131416", name: "theme-color" },
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
    <main className="frame py-32">
      <h1 className="text-head">Page not found</h1>
      <p className="mt-4">
        <Link to="/" className="text-accent underline underline-offset-2">
          Back to the home page
        </Link>
      </p>
    </main>
  ),
});
