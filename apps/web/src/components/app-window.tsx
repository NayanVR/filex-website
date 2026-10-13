import {
  Clock,
  Download,
  FileArchive,
  FileCode,
  FileText,
  Film,
  Folder,
  HardDrive,
  House,
  Image,
  Monitor,
  Music,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * A drawn (not screenshotted) Filex window that types search queries on a loop.
 * Colours mirror the app's default dark theme in filex/src/ui/theme.rs.
 * ponytail: stand-in until real screenshots or a screen recording exist.
 */

type Kind = "archive" | "code" | "doc" | "folder" | "image" | "music" | "video";

const KIND_ICON: Record<Kind, LucideIcon> = {
  archive: FileArchive,
  code: FileCode,
  doc: FileText,
  folder: Folder,
  image: Image,
  music: Music,
  video: Film,
};

const KIND_TINT: Record<Kind, string> = {
  archive: "text-amber-300",
  code: "text-emerald-300",
  doc: "text-sky-300",
  folder: "text-accent",
  image: "text-pink-300",
  music: "text-violet-300",
  video: "text-orange-300",
};

const FILES: readonly {
  name: string;
  path: string;
  kind: Kind;
  size: string;
  date: string;
}[] = [
  {
    date: "Today, 09:14",
    kind: "doc",
    name: "invoice-2026-10.pdf",
    path: "~/Documents/Finance",
    size: "212 KB",
  },
  {
    date: "Yesterday",
    kind: "doc",
    name: "invoice-2026-09.pdf",
    path: "~/Documents/Finance",
    size: "198 KB",
  },
  {
    date: "12 Sep",
    kind: "archive",
    name: "invoices-2025.zip",
    path: "~/Archive",
    size: "14.2 MB",
  },
  {
    date: "3 Aug",
    kind: "doc",
    name: "Invoice template.docx",
    path: "~/Documents/Templates",
    size: "48 KB",
  },
  {
    date: "Today, 11:02",
    kind: "image",
    name: "IMG_4021.HEIC",
    path: "~/Pictures/Iceland",
    size: "3.1 MB",
  },
  {
    date: "Today, 11:02",
    kind: "image",
    name: "IMG_4022.HEIC",
    path: "~/Pictures/Iceland",
    size: "2.9 MB",
  },
  {
    date: "2 Oct",
    kind: "video",
    name: "iceland-drone.mov",
    path: "~/Movies",
    size: "1.2 GB",
  },
  {
    date: "28 Sep",
    kind: "folder",
    name: "Iceland 2026",
    path: "~/Pictures",
    size: "—",
  },
  {
    date: "Today, 08:40",
    kind: "code",
    name: "main.rs",
    path: "~/code/filex/src",
    size: "6 KB",
  },
  {
    date: "Yesterday",
    kind: "code",
    name: "search.rs",
    path: "~/code/filex/src/search",
    size: "18 KB",
  },
  {
    date: "1 Oct",
    kind: "code",
    name: "Cargo.toml",
    path: "~/code/filex",
    size: "3 KB",
  },
  {
    date: "19 Jul",
    kind: "music",
    name: "demo-mix-final.wav",
    path: "~/Music/Projects",
    size: "88 MB",
  },
  {
    date: "Today, 10:21",
    kind: "doc",
    name: "Resume 2026.pdf",
    path: "~/Documents/Career",
    size: "96 KB",
  },
  {
    date: "14 Aug",
    kind: "doc",
    name: "resume-old.docx",
    path: "~/Documents/Career/Archive",
    size: "41 KB",
  },
  {
    date: "5 May",
    kind: "doc",
    name: "Lease agreement.pdf",
    path: "~/Documents/Home",
    size: "1.1 MB",
  },
];

const QUERIES = ["invoice", "iceland", "resume", "demo"] as const;
const TYPE_MS = 110;
const HOLD_MS = 1900;
const VISIBLE_ROWS = 7;

const SIDEBAR = [
  { icon: House, label: "Home" },
  { icon: Monitor, label: "Desktop" },
  { icon: FileText, label: "Documents" },
  { icon: Download, label: "Downloads" },
  { icon: Clock, label: "Recents" },
] as const;

const TAGS = [
  { color: "bg-red-400", label: "Urgent" },
  { color: "bg-amber-300", label: "Work" },
  { color: "bg-emerald-400", label: "Personal" },
] as const;

/** Cycles through QUERIES one keystroke at a time; static under reduced motion. */
const useTypedQuery = (): string => {
  const [text, setText] = useState<string>(QUERIES[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let query = 0;
    let typed = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const target = QUERIES[query];
      if (typed < target.length) {
        typed += 1;
        setText(target.slice(0, typed));
        timer = setTimeout(tick, TYPE_MS);
        return;
      }
      timer = setTimeout(() => {
        query = (query + 1) % QUERIES.length;
        typed = 0;
        setText("");
        tick();
      }, HOLD_MS);
    };
    // Start by holding the first query, which is already rendered.
    typed = QUERIES[0].length;
    tick();
    return () => clearTimeout(timer);
  }, []);

  return text;
};

const Highlight = ({ name, query }: { name: string; query: string }) => {
  const at = query ? name.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at < 0) {
    return name;
  }
  return (
    <>
      {name.slice(0, at)}
      <mark className="text-accent rounded-sm bg-transparent font-semibold">
        {name.slice(at, at + query.length)}
      </mark>
      {name.slice(at + query.length)}
    </>
  );
};

/** Selected first hit while searching, otherwise zebra stripes like the app. */
const rowTint = (index: number, query: string): string => {
  if (index === 0 && query) {
    return "bg-[#233e50]";
  }
  return index % 2 ? "bg-[#1b1f25]" : "";
};

const Sidebar = () => (
  <aside className="hidden w-44 shrink-0 flex-col gap-5 border-r border-white/6 bg-[#14171b] p-3 text-[12px] md:flex">
    <div>
      <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-wider text-[#6b7584] uppercase">
        Favourites
      </p>
      {SIDEBAR.map(({ icon: Icon, label }, index) => (
        <div
          key={label}
          className={`flex items-center gap-2 rounded-md px-2 py-1 ${index === 2 ? "text-text bg-white/6" : "text-muted"}`}
        >
          <Icon size={13} className="text-accent" aria-hidden="true" />
          {label}
        </div>
      ))}
    </div>
    <div>
      <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-wider text-[#6b7584] uppercase">
        Drives
      </p>
      <div className="text-muted flex items-center gap-2 px-2 py-1">
        <HardDrive size={13} className="text-accent" aria-hidden="true" />
        Macintosh HD
      </div>
    </div>
    <div>
      <p className="mb-1.5 px-2 text-[10px] font-semibold tracking-wider text-[#6b7584] uppercase">
        Tags
      </p>
      {TAGS.map(({ color, label }) => (
        <div
          key={label}
          className="text-muted flex items-center gap-2 px-2 py-1"
        >
          <span className={`size-2 rounded-full ${color}`} />
          {label}
        </div>
      ))}
    </div>
  </aside>
);

export const AppWindow = ({ className = "" }: { className?: string }) => {
  const query = useTypedQuery();
  const matches = FILES.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase())
  );
  const rows = query ? matches : FILES;
  // Fake but plausible: more indexed hits for shorter queries.
  const hits = query
    ? Math.max(rows.length, Math.round(48_000 / query.length ** 3))
    : 0;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#181b20] text-left shadow-[0_40px_120px_-30px_rgb(0_0_0/0.8)] ring-1 ring-black/40 ${className}`}
      aria-hidden="true"
    >
      {/* Title bar */}
      <div className="flex h-11 items-center gap-3 border-b border-white/6 bg-[#14171b] px-4">
        <div className="flex gap-2" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-md border border-white/8 bg-[#1f242b] px-3 py-1.5 text-[12px]">
          <Search
            size={13}
            className="text-muted shrink-0"
            aria-hidden="true"
          />
          <span className="text-text font-mono">{query}</span>
          <span className="caret bg-accent -ml-1.5 h-3.5 w-px" />
          <span className="ml-auto text-[10px] text-[#6b7584]">⌘K</span>
        </div>
        <div className="w-14" />
      </div>

      <div className="flex h-[340px] sm:h-[380px]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/6 px-4 py-2 text-[10px] font-semibold tracking-wider text-[#6b7584] uppercase sm:grid-cols-[minmax(0,1fr)_7rem_4.5rem]">
            <span>Name</span>
            <span className="hidden sm:block">Modified</span>
            <span className="text-right">Size</span>
          </div>
          <ul className="flex-1 overflow-hidden text-[12.5px]">
            {rows
              .slice(0, VISIBLE_ROWS)
              .map(({ name, path, kind, size, date }, index) => {
                const Icon = KIND_ICON[kind];
                return (
                  <li
                    key={name}
                    className={`row-in grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-2 sm:grid-cols-[minmax(0,1fr)_7rem_4.5rem] ${rowTint(index, query)}`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        size={15}
                        className={`shrink-0 ${KIND_TINT[kind]}`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="text-text block truncate">
                          <Highlight name={name} query={query} />
                        </span>
                        <span className="block truncate text-[10.5px] text-[#6b7584]">
                          {path}
                        </span>
                      </span>
                    </span>
                    <span className="text-muted hidden sm:block">{date}</span>
                    <span className="text-muted text-right tabular-nums">
                      {size}
                    </span>
                  </li>
                );
              })}
          </ul>
          <div className="flex items-center gap-3 border-t border-white/6 bg-[#14171b] px-4 py-1.5 text-[11px] text-[#6b7584] tabular-nums">
            {query ? (
              <>
                <span>{hits.toLocaleString("en-US")} results</span>
                <span className="text-accent">1.{query.length + 1} ms</span>
              </>
            ) : (
              <span>13 items</span>
            )}
            <span className="ml-auto">213,402 files indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
