import { ArrowRight, FileText, Image, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { Folder } from "@/components/folder";

// Every fragment below is the app's interface, built in HTML with its dark-theme colours.
const Window = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div
    data-ui
    className="font-ui flex h-full flex-col overflow-hidden rounded-[14px] bg-[#1c1d21] text-[13px] text-[#ececef]"
  >
    <div className="flex h-10 shrink-0 items-center gap-2 bg-[#131416] px-4">
      <span className="size-3 rounded-full bg-[#ff5f57]" />
      <span className="size-3 rounded-full bg-[#febc2e]" />
      <span className="size-3 rounded-full bg-[#28c840]" />
      <span className="ml-3 text-[#a3a7b0]">{title}</span>
    </div>
    <div className="min-h-0 flex-1">{children}</div>
  </div>
);

const Row = ({
  children,
  index,
  selected = false,
}: {
  children: ReactNode;
  index: number;
  selected?: boolean;
}) => {
  let tint = "";
  if (selected) {
    tint = "bg-[#203a4a]";
  } else if (index % 2) {
    tint = "bg-[#222328]";
  }
  return (
    <li className={`flex items-center gap-2.5 px-4 py-2.5 ${tint}`}>
      {children}
    </li>
  );
};

const ChipsFragment = () => (
  <Window title="Search">
    <div className="p-5">
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-[#131416] px-3 py-2.5 ring-2 ring-[#5ac8fa]">
        <span>invoice</span>
        {["ext:pdf", "modified:this-month"].map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-md bg-[#5ac8fa]/18 px-2 py-0.5 text-[#8fdcff]"
          >
            {chip}
            <X size={12} aria-hidden="true" />
          </span>
        ))}
        <span className="caret h-4 w-px bg-[#5ac8fa]" />
      </div>
      <p className="mt-5 text-[#a3a7b0]">Add a filter</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {["kind:image", "size:>2mb", "tag:work", "in:~/Documents"].map(
          (chip) => (
            <span
              key={chip}
              className="rounded-md bg-white/6 px-2 py-1 text-[#c9ccd2]"
            >
              {chip}
            </span>
          )
        )}
      </div>
    </div>
    <ul>
      {[
        "invoice-2026-10.pdf",
        "invoice-2026-10-acme.pdf",
        "invoice-2026-10-refund.pdf",
      ].map((name, index) => (
        <Row key={name} index={index} selected={index === 0}>
          <FileText size={16} className="text-[#8fa6bd]" aria-hidden="true" />
          {name}
          <span className="ml-auto text-[#a3a7b0]">~/Documents/Finance</span>
        </Row>
      ))}
    </ul>
  </Window>
);

const FRAMES = Array.from({ length: 16 }, (_, index) => ({
  name: `frame_${String(index * 15_559 + 4).padStart(6, "0")}.exr`,
  size: `${(4 + ((index * 7) % 9) / 10).toFixed(1)} MB`,
}));

const FolderFragment = () => (
  <Window title="renders › shot_040">
    <div className="flex h-full flex-col">
      <p className="flex shrink-0 justify-between px-4 py-2.5 text-[#a3a7b0] tabular-nums">
        <span>Name</span>
        <span>248,913 items</span>
      </p>
      <div className="min-h-0 flex-1 overflow-hidden">
        <ul className="scroll-list">
          {[...FRAMES, ...FRAMES].map(({ name, size }, index) => (
            <Row key={`${name}-${index}`} index={index}>
              <Image size={16} className="text-[#30a46c]" aria-hidden="true" />
              {name}
              <span className="ml-auto text-[#a3a7b0] tabular-nums">
                {size}
              </span>
            </Row>
          ))}
        </ul>
      </div>
    </div>
  </Window>
);

// theme::fixed::tag, Finder's own tag colours.
const TAGS = [
  { color: "#fb5850", count: 4, label: "Urgent" },
  { color: "#f7a53b", count: 12, label: "Work" },
  { color: "#5bd15b", count: 31, label: "Personal" },
  { color: "#2f95ff", count: 7, label: "Travel" },
] as const;

const TaggedFiles = [
  { name: "Lease agreement.pdf", tags: ["#fb5850", "#5bd15b"] },
  { name: "Q4 roadmap.key", tags: ["#f7a53b"] },
  { name: "boarding-pass-KEF.pdf", tags: ["#2f95ff", "#fb5850"] },
  { name: "passport-scan.pdf", tags: ["#2f95ff"] },
  { name: "budget-2027.numbers", tags: ["#f7a53b", "#5bd15b"] },
] as const;

const TagsFragment = () => (
  <Window title="Tags">
    <div className="flex h-full">
      <ul className="w-40 shrink-0 bg-[#131416] p-3">
        {TAGS.map(({ color, count, label }, index) => (
          <li
            key={label}
            className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${index === 0 ? "bg-white/7" : "text-[#c9ccd2]"}`}
          >
            <span
              className="size-2.5 rounded-full"
              style={{ background: color }}
            />
            {label}
            <span className="ml-auto text-[#a3a7b0] tabular-nums">{count}</span>
          </li>
        ))}
      </ul>
      <ul className="min-w-0 flex-1">
        {TaggedFiles.map(({ name, tags }, index) => (
          <Row key={name} index={index} selected={index === 0}>
            <FileText
              size={16}
              className="shrink-0 text-[#8fa6bd]"
              aria-hidden="true"
            />
            <span className="truncate">{name}</span>
            <span className="ml-auto flex -space-x-1">
              {tags.map((color) => (
                <span
                  key={color}
                  className="size-3 rounded-full ring-2 ring-[#1c1d21]"
                  style={{ background: color }}
                />
              ))}
            </span>
          </Row>
        ))}
      </ul>
    </div>
  </Window>
);

const PreviewFragment = () => (
  <Window title="Pictures › Iceland 2026">
    <div className="grid h-full grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <ul>
        {[
          "IMG_4021.HEIC",
          "gullfoss-snow.jpg",
          "IMG_4023.HEIC",
          "kerid-crater.jpg",
          "IMG_4027.HEIC",
        ].map((name, index) => (
          <Row key={name} index={index} selected={index === 1}>
            <Image
              size={16}
              className="shrink-0 text-[#30a46c]"
              aria-hidden="true"
            />
            <span className="truncate">{name}</span>
          </Row>
        ))}
      </ul>
      <div className="flex flex-col gap-3 bg-[#131416] p-4">
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
          <img
            src="/photos/gullfoss.jpg"
            alt="Gullfoss waterfall in Iceland under snow"
            width="1000"
            height="625"
            loading="lazy"
            className="drift h-full w-full object-cover"
          />
        </div>
        <p className="font-semibold">gullfoss-snow.jpg</p>
        <p className="-mt-2 text-[#a3a7b0]">
          JPEG image · 1920 × 1200 · 2.9 MB
        </p>
      </div>
    </div>
  </Window>
);

const RENAMES = [
  ["IMG_4021.HEIC", "2026-09-28 Thingvellir.heic"],
  ["IMG_4022.HEIC", "2026-09-28 Gullfoss.heic"],
  ["IMG_4023.HEIC", "2026-09-29 Kerid.heic"],
  ["IMG_4027.HEIC", "2026-10-01 Vik.heic"],
] as const;

const MagicFragment = () => (
  <Window title="Magic mode">
    <div className="flex h-full flex-col p-5">
      <p className="flex items-center gap-2 rounded-lg bg-[#131416] px-3 py-2.5">
        <Sparkles size={15} className="text-[#5ac8fa]" aria-hidden="true" />
        Rename the Iceland photos by date and place
      </p>
      <p className="mt-5 text-[#a3a7b0]">Nothing changes until you confirm.</p>
      <ul className="mt-2 flex-1">
        {RENAMES.map(([from, to], index) => (
          <li
            key={from}
            className={`grid grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)] items-center gap-3 rounded-md px-3 py-2 ${index % 2 ? "bg-[#222328]" : ""}`}
          >
            <span className="truncate text-[#a3a7b0] line-through">{from}</span>
            <ArrowRight
              size={14}
              className="text-[#5ac8fa]"
              aria-hidden="true"
            />
            <span className="truncate">{to}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end gap-2">
        <span className="rounded-md bg-white/7 px-3 py-1.5">Cancel</span>
        <span className="rounded-md bg-[#5ac8fa] px-3 py-1.5 font-semibold text-[#131416]">
          Rename 4 files
        </span>
      </div>
    </div>
  </Window>
);

// theme.rs accent presets: the default sky, then blue, purple, pink, red, orange, green, teal.
const ACCENTS = [
  "#5ac8fa",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#22c55e",
  "#14b8a6",
] as const;

const Segmented = ({
  options,
  active,
}: {
  options: readonly string[];
  active: string;
}) => (
  <span className="inline-flex rounded-lg bg-white/6 p-1">
    {options.map((option) => (
      <span
        key={option}
        className={`rounded-md px-3 py-1 ${option === active ? "bg-[#1c1d21] font-semibold" : "text-[#a3a7b0]"}`}
      >
        {option}
      </span>
    ))}
  </span>
);

const SettingRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <li className="flex flex-wrap items-center justify-between gap-3 py-3.5">
    <span>{label}</span>
    {children}
  </li>
);

const AppearanceFragment = () => (
  <Window title="Settings › Appearance">
    <div className="flex h-full">
      <ul className="hidden w-40 shrink-0 bg-[#131416] p-3 sm:block">
        {["General", "Appearance", "Search", "Keyboard", "Privacy"].map(
          (label) => (
            <li
              key={label}
              className={`rounded-md px-2 py-1.5 ${label === "Appearance" ? "bg-white/7" : "text-[#a3a7b0]"}`}
            >
              {label}
            </li>
          )
        )}
      </ul>
      <ul className="min-w-0 flex-1 px-5 py-2">
        <SettingRow label="Theme">
          <Segmented options={["Light", "Dark", "OLED"]} active="Dark" />
        </SettingRow>
        <SettingRow label="Accent">
          <span className="flex gap-1.5">
            {ACCENTS.map((color, index) => (
              <span
                key={color}
                className={`size-5 rounded-full ${index === 0 ? "ring-2 ring-white ring-offset-2 ring-offset-[#1c1d21]" : ""}`}
                style={{ background: color }}
              />
            ))}
          </span>
        </SettingRow>
        <SettingRow label="Custom accent">
          <span className="rounded-md bg-[#131416] px-3 py-1">#5AC8FA</span>
        </SettingRow>
        <SettingRow label="Density">
          <Segmented
            options={["Comfortable", "Compact"]}
            active="Comfortable"
          />
        </SettingRow>
      </ul>
    </div>
  </Window>
);

const ITEMS = [
  {
    color: "#006ddc",
    fact: "Mix filters with plain text, like invoice ext:pdf modified:this-month.",
    fragment: <ChipsFragment />,
    name: "Filter chips",
  },
  {
    color: "#b5740f",
    fact: "Filex draws only the rows on screen, so a quarter of a million files scroll like twenty.",
    fragment: <FolderFragment />,
    name: "Huge folders",
  },
  {
    color: "#23855a",
    fact: "Tag files and filter by tag. On macOS, tags sync both ways with Finder.",
    fragment: <TagsFragment />,
    name: "Tags",
  },
  {
    color: "#c2427f",
    fact: "Thumbnails and previews for your files. On macOS, Space opens Quick Look.",
    fragment: <PreviewFragment />,
    name: "Previews",
  },
  {
    color: "#3d5a78",
    fact: "Describe a batch change. Filex shows every rename and move before it does anything.",
    fragment: <MagicFragment />,
    name: "Magic mode",
  },
  {
    color: "#0b7a8a",
    fact: "Dark, light and OLED themes, accent presets or any hex colour, and a compact density.",
    fragment: <AppearanceFragment />,
    name: "Make it yours",
  },
] as const;

const CYCLE_MS = 6000;

/** One folder, five things it holds. Cycles while in view until the visitor picks one. */
export const Showcase = () => {
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      picked ||
      !el ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);
    const timer = setInterval(() => {
      if (visible && !document.hidden) {
        setActive((current) => (current + 1) % ITEMS.length);
      }
    }, CYCLE_MS);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [picked]);

  const item = ITEMS[active];

  return (
    <section
      ref={ref}
      id="features"
      aria-labelledby="features-title"
      className="frame grid scroll-mt-8 gap-x-6 gap-y-10 py-[clamp(96px,12vw,200px)] lg:grid-cols-12 lg:items-center"
    >
      <h2
        id="features-title"
        className="text-head lg:col-span-12 lg:mb-6"
        data-reveal
      >
        What&apos;s inside
      </h2>
      <ul className="flex flex-col gap-2 lg:col-span-4" aria-label="Features">
        {ITEMS.map(({ name, color, fact }, index) => {
          const isActive = index === active;
          return (
            <li key={name}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActive(index);
                  setPicked(true);
                }}
                className={`text-lead flex items-center gap-4 py-1 text-left transition-colors duration-300 ${isActive ? "text-text" : "text-muted hover:text-text"}`}
              >
                <span
                  className="size-3 shrink-0 rounded-full transition-colors duration-300"
                  style={{ background: isActive ? color : "var(--raised)" }}
                  aria-hidden="true"
                />
                {name}
              </button>
              {isActive && (
                <p
                  className="crossfade mt-1 mb-3 ml-7 max-w-[34ch]"
                  aria-live="polite"
                >
                  {fact}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <div className="lg:col-span-8 lg:col-start-5" data-reveal>
        <Folder
          fill={item.color}
          className="h-[clamp(420px,56vh,540px)]"
          bodyClassName="p-[clamp(12px,2.2vw,32px)]"
        >
          <div className="h-full w-full">{item.fragment}</div>
        </Folder>
      </div>
    </section>
  );
};
