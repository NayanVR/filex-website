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
import { useEffect, useId, useState } from "react";

/**
 * A Filex window built in HTML, colours from the app's dark theme (filex/src/ui/theme.rs).
 * Its search field is real: it types sample queries on a loop until the visitor types their own.
 * ponytail: drawn stand-in until real screenshots or a screen recording exist.
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

// theme::fixed::kind; folders take the accent.
const KIND_TINT: Record<Kind, string> = {
  archive: "#d08b1e",
  code: "#4c8bf0",
  doc: "#8fa6bd",
  folder: "#5ac8fa",
  image: "#30a46c",
  music: "#e0559a",
  video: "#a78bfa",
};

interface SampleFile {
  name: string;
  path: string;
  kind: Kind;
  size: string;
  date: string;
}

const FILES: readonly SampleFile[] = [
  {
    date: "Today",
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
    date: "Today",
    kind: "image",
    name: "IMG_4021.HEIC",
    path: "~/Pictures/Iceland",
    size: "3.1 MB",
  },
  {
    date: "Today",
    kind: "image",
    name: "gullfoss-snow.jpg",
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
    date: "Today",
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
    date: "Today",
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
  {
    date: "9 Jun",
    kind: "doc",
    name: "passport-scan.pdf",
    path: "~/Documents/Travel",
    size: "2.4 MB",
  },
  {
    date: "9 Jun",
    kind: "doc",
    name: "boarding-pass-KEF.pdf",
    path: "~/Downloads",
    size: "180 KB",
  },
  {
    date: "22 Apr",
    kind: "archive",
    name: "tax-return-2025.zip",
    path: "~/Documents/Finance",
    size: "6.8 MB",
  },
  {
    date: "Today",
    kind: "image",
    name: "screenshot 09.41.png",
    path: "~/Desktop",
    size: "1.4 MB",
  },
  {
    date: "30 Sep",
    kind: "music",
    name: "voice memo 12.m4a",
    path: "~/Music/Memos",
    size: "4.2 MB",
  },
  {
    date: "4 Sep",
    kind: "doc",
    name: "invoice-2026-08.pdf",
    path: "~/Documents/Finance",
    size: "204 KB",
  },
  {
    date: "21 Sep",
    kind: "doc",
    name: "iceland-itinerary.pdf",
    path: "~/Documents/Travel",
    size: "320 KB",
  },
  {
    date: "2 Feb",
    kind: "doc",
    name: "resume-design-roles.pdf",
    path: "~/Documents/Career",
    size: "102 KB",
  },
  {
    date: "11 Mar",
    kind: "doc",
    name: "passport-renewal-form.pdf",
    path: "~/Documents/Travel",
    size: "640 KB",
  },
  {
    date: "1 Oct",
    kind: "image",
    name: "bus-pass-october.png",
    path: "~/Downloads",
    size: "210 KB",
  },
];

const QUERIES = ["invoice", "iceland", "2026"] as const;
const TYPE_MS = 110;
const HOLD_MS = 2200;
const VISIBLE_ROWS = 6;

const SIDEBAR = [
  { icon: House, label: "Home" },
  { icon: Monitor, label: "Desktop" },
  { icon: FileText, label: "Documents" },
  { icon: Download, label: "Downloads" },
  { icon: Clock, label: "Recents" },
  { icon: HardDrive, label: "Macintosh HD" },
] as const;

/** Types QUERIES one keystroke at a time until `stopped`; static under reduced motion. */
const useTypedQuery = (stopped: boolean): string => {
  const [text, setText] = useState<string>(QUERIES[0]);

  useEffect(() => {
    if (
      stopped ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let query = 0;
    let typed = QUERIES[0].length;
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
    tick();
    return () => clearTimeout(timer);
  }, [stopped]);

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
      <mark className="bg-transparent font-semibold text-[#5ac8fa]">
        {name.slice(at, at + query.length)}
      </mark>
      {name.slice(at + query.length)}
    </>
  );
};

/** Selected first hit while searching, otherwise zebra stripes like the app. */
const rowTint = (index: number, query: string): string => {
  if (index === 0 && query) {
    return "bg-[#203a4a]";
  }
  return index % 2 ? "bg-[#222328]" : "";
};

export const AppWindow = ({ className = "" }: { className?: string }) => {
  const [own, setOwn] = useState<string | null>(null);
  const typed = useTypedQuery(own !== null);
  const query = (own ?? typed).trim();
  const id = useId();

  const rows = query
    ? FILES.filter(({ name, path }) =>
        `${name} ${path}`.toLowerCase().includes(query.toLowerCase())
      )
    : FILES;

  return (
    <div
      data-ui
      className={`font-ui overflow-hidden rounded-[14px] bg-[#1c1d21] text-left text-[13px] text-[#ececef] ${className}`}
    >
      {/* Title bar: traffic lights inset into the tab bar, search field in the middle. */}
      <div className="flex h-12 items-center gap-3 bg-[#131416] px-4">
        <div className="flex gap-2" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <label className="mx-auto flex w-full max-w-md items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 focus-within:bg-[#1c1d21] focus-within:ring-2 focus-within:ring-[#5ac8fa]">
          <Search
            size={14}
            className="shrink-0 text-[#a3a7b0]"
            aria-hidden="true"
          />
          <span className="sr-only">Try it: search the sample files</span>
          <input
            type="search"
            value={own ?? typed}
            onChange={(event) => setOwn(event.target.value)}
            onFocus={() => setOwn((current) => current ?? typed)}
            aria-controls={`${id}-results`}
            placeholder="Search files"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#a3a7b0]"
          />
          {own === null && (
            <span
              className="caret -ml-1.5 h-3.5 w-px bg-[#5ac8fa]"
              aria-hidden="true"
            />
          )}
        </label>
        <span className="w-12" aria-hidden="true" />
      </div>

      <div className="flex h-[311px] sm:h-[366px]">
        <aside
          className="hidden w-44 shrink-0 flex-col gap-0.5 bg-[#131416] p-3 md:flex"
          aria-hidden="true"
        >
          {SIDEBAR.map(({ icon: Icon, label }, index) => (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${index === 2 ? "bg-white/7" : "text-[#a3a7b0]"}`}
            >
              <Icon size={14} className="text-[#5ac8fa]" />
              {label}
            </div>
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <ul
            id={`${id}-results`}
            className="flex-1 overflow-hidden"
            aria-label="Results"
          >
            {rows
              .slice(0, VISIBLE_ROWS)
              .map(({ name, path, kind, size, date }, index) => {
                const Icon = KIND_ICON[kind];
                return (
                  <li
                    key={name}
                    className={`grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-2 sm:grid-cols-[minmax(0,1fr)_5.5rem_4.5rem] ${rowTint(index, query)}`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        size={16}
                        className="shrink-0"
                        style={{ color: KIND_TINT[kind] }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate">
                          <Highlight name={name} query={query} />
                        </span>
                        <span className="block truncate text-[13px] text-[#a3a7b0]">
                          {path}
                        </span>
                      </span>
                    </span>
                    <span className="hidden text-[#a3a7b0] sm:block">
                      {date}
                    </span>
                    <span className="text-right text-[#a3a7b0] tabular-nums">
                      {size}
                    </span>
                  </li>
                );
              })}
          </ul>
          <p
            className="flex items-center gap-3 bg-[#131416] px-4 py-2 text-[#a3a7b0] tabular-nums"
            aria-live="polite"
          >
            {query
              ? `${rows.length} of ${FILES.length} sample files match “${query}”`
              : `${FILES.length} sample files`}
          </p>
        </div>
      </div>
    </div>
  );
};
