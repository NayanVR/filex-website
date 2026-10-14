import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Eye,
  FileText,
  Folder,
  Keyboard,
  Lock,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import { AppWindow } from "@/components/app-window";
import {
  DownloadButton,
  InstallSection,
  secondaryButtonClass,
} from "@/components/download";
import { REPO_URL, useAssets } from "@/lib/release";

// The three logo layers fly in from slightly different places and settle into the mark.
const LOGO_LAYERS = [
  { delay: "0ms", from: "translateY(-14%) scale(0.9)", name: "back" },
  { delay: "120ms", from: "translateY(18%)", name: "front" },
  { delay: "260ms", from: "scale(0.6) rotate(-12deg)", name: "mark" },
] as const;

const AnimatedLogo = ({ className = "w-16" }: { className?: string }) => (
  <div className={`relative aspect-[700/601] ${className}`} aria-hidden="true">
    {LOGO_LAYERS.map(({ name, from, delay }) => (
      <img
        key={name}
        src={`/logo/${name}.svg`}
        alt=""
        width="80"
        height="69"
        className="logo-layer absolute inset-0 h-full w-full"
        style={{ "--from": from, animationDelay: delay } as CSSProperties}
      />
    ))}
  </div>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="text-muted mb-4 font-mono text-xs tracking-[0.2em] uppercase">
    {children}
  </p>
);

const Section = ({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  children: ReactNode;
}) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-36"
  >
    <div className="mb-14 max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={`${id}-title`}
        className="text-gradient text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-6xl"
      >
        {title}
      </h2>
      {lede && (
        <p className="text-muted mt-5 text-lg leading-8 text-pretty">{lede}</p>
      )}
    </div>
    {children}
  </section>
);

const ReleasePill = () => {
  const { version } = useAssets();
  return (
    <Link
      to="/download"
      className="rise group border-line text-muted hover:text-text inline-flex items-center gap-2 rounded-full border bg-white/[0.03] py-1 pr-3 pl-1 text-sm backdrop-blur transition"
    >
      <span className="text-text rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold">
        {version ? `v${version}` : "New"}
      </span>
      Now on Windows, macOS and Linux
      <ArrowRight
        size={14}
        className="transition group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
};

// Share of the viewport height scrolled before the window stands fully upright.
const TILT_DISTANCE = 0.5;

/** Writes page-scroll progress (0 → 1) to --tilt. Stays flat under reduced motion. */
const useTiltOnScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = window.scrollY / (window.innerHeight * TILT_DISTANCE);
      el.style.setProperty("--tilt", String(Math.min(progress, 1)));
    };
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
};

const Hero = () => {
  const tiltRef = useTiltOnScroll();
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-[-30%] left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.07),transparent)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 text-center sm:pt-24">
        <ReleasePill />
        <h1
          className="rise text-gradient mt-8 max-w-4xl text-5xl leading-[1] font-semibold tracking-[-0.045em] text-balance sm:text-8xl"
          style={{ animationDelay: "80ms" }}
        >
          The file explorer that keeps up.
        </h1>
        <p
          className="rise text-muted mt-6 max-w-2xl text-lg leading-8 text-pretty sm:text-xl"
          style={{ animationDelay: "160ms" }}
        >
          A native file explorer for Windows, macOS and Linux. Huge folders open
          instantly, and any file on your computer is a few keystrokes away.
        </p>
        <div className="rise mt-10" style={{ animationDelay: "240ms" }}>
          <DownloadButton
            secondary={
              <a href={REPO_URL} className={secondaryButtonClass}>
                <Star
                  size={16}
                  className="transition group-hover:scale-110 group-hover:rotate-[72deg] group-hover:fill-amber-300 group-hover:text-amber-300"
                  aria-hidden="true"
                />
                Star on GitHub
              </a>
            }
          />
        </div>

        <div
          ref={tiltRef}
          className="rise relative mt-14 w-full"
          style={{ animationDelay: "360ms" }}
        >
          <div
            className="bg-accent/10 pointer-events-none absolute inset-x-[15%] top-10 bottom-0 rounded-full blur-[120px]"
            aria-hidden="true"
          />
          <AppWindow className="tilt-in mx-auto max-w-5xl" />
          <div
            className="from-bg pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

/** Small framed visual used beside each spotlight. */
const Stage = ({ children }: { children: ReactNode }) => (
  <div className="card relative overflow-hidden p-6 sm:p-8" aria-hidden="true">
    <div className="relative">{children}</div>
  </div>
);

const KEYSTROKES = [
  { hits: "48,112", ms: "1.4", text: "i" },
  { hits: "6,031", ms: "1.1", text: "in" },
  { hits: "802", ms: "0.9", text: "inv" },
  { hits: "37", ms: "0.6", text: "invo" },
] as const;

const SearchVisual = () => (
  <ul className="space-y-2 font-mono text-sm">
    {KEYSTROKES.map(({ text, hits, ms }, index) => (
      <li
        key={text}
        className="border-line flex items-center gap-3 rounded-lg border bg-black/20 px-4 py-3"
        style={{ opacity: 0.55 + index * 0.15 }}
      >
        <span className="text-text">{text}</span>
        <span className="caret bg-accent -ml-2 h-4 w-px" />
        <span className="text-muted ml-auto text-xs">{hits} matches</span>
        <span className="bg-accent/15 text-accent rounded px-1.5 py-0.5 text-xs">
          {ms} ms
        </span>
      </li>
    ))}
  </ul>
);

const CHIPS = [
  "kind:image",
  "ext:pdf",
  "size:>2mb",
  "modified:today",
  "tag:work",
] as const;

const ChipsVisual = () => (
  <div>
    <div className="border-line flex flex-wrap items-center gap-2 rounded-lg border bg-black/20 px-3 py-2.5 text-sm">
      <span className="text-text">invoice</span>
      {["ext:pdf", "modified:today"].map((chip) => (
        <span
          key={chip}
          className="bg-accent/15 text-accent ring-accent/30 inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs ring-1"
        >
          {chip}
          <X size={11} />
        </span>
      ))}
      <span className="caret bg-accent h-4 w-px" />
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      {CHIPS.map((chip) => (
        <span
          key={chip}
          className="border-line text-muted rounded-md border bg-white/[0.02] px-2 py-1 font-mono text-xs"
        >
          {chip}
        </span>
      ))}
    </div>
    <div className="mt-5 space-y-1.5 text-sm">
      {["invoice-2026-10.pdf", "invoice-acme-final.pdf"].map((name) => (
        <div
          key={name}
          className="flex items-center gap-2 rounded-md bg-white/[0.03] px-3 py-2"
        >
          <FileText size={14} className="text-sky-300" />
          <span className="text-text">{name}</span>
          <span className="text-muted ml-auto text-xs">Today</span>
        </div>
      ))}
    </div>
  </div>
);

const BIG_FOLDER = Array.from({ length: 14 }, (_, index) => ({
  name: `frame_${String(index * 17_389 + 4).padStart(6, "0")}.exr`,
  size: `${(4 + ((index * 7) % 9) / 10).toFixed(1)} MB`,
}));

const FolderVisual = () => (
  <div>
    <div className="text-muted mb-3 flex items-center gap-2 text-xs">
      <Folder size={14} className="text-accent" />
      renders / shot_040
      <span className="ml-auto tabular-nums">248,913 items</span>
    </div>
    <div className="border-line h-56 overflow-hidden rounded-lg border bg-black/20 [mask-image:linear-gradient(transparent,black_15%,black_85%,transparent)]">
      <ul className="scroll-list font-mono text-xs">
        {[...BIG_FOLDER, ...BIG_FOLDER].map(({ name, size }, index) => (
          <li
            key={`${name}-${index}`}
            className={`flex px-4 py-2 ${index % 2 ? "bg-white/[0.02]" : ""}`}
          >
            <span className="text-text">{name}</span>
            <span className="text-muted ml-auto">{size}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Spotlight = ({
  eyebrow,
  title,
  body,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: ReactNode;
  visual: ReactNode;
  reverse?: boolean;
}) => (
  <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:gap-20">
    <div className={reverse ? "md:order-2" : ""}>
      <p className="text-muted mb-2 font-mono text-xs tracking-wider uppercase">
        {eyebrow}
      </p>
      <h3 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
        {title}
      </h3>
      <div className="text-muted mt-4 text-lg leading-8">{body}</div>
    </div>
    {visual}
  </div>
);

const FEATURES: readonly {
  icon: LucideIcon;
  title: string;
  body: string;
  wide?: boolean;
}[] = [
  {
    body: "Describe what you want, like moving or renaming a batch of files, and Filex shows exactly what it will do first. Nothing happens until you confirm.",
    icon: Sparkles,
    title: "Magic mode",
    wide: true,
  },
  {
    body: "Tag files and filter by tag. On macOS, tags sync both ways with Finder.",
    icon: Tag,
    title: "Tags",
  },
  {
    body: "Thumbnails and previews for your files. On macOS, press Space for Quick Look.",
    icon: Eye,
    title: "Previews",
  },
  {
    body: "Single-key shortcuts for everything you do often. Press ? to see them all.",
    icon: Keyboard,
    title: "Keyboard-first",
  },
  {
    body: "Dark, light and OLED themes, accent presets or any hex colour, density settings, and vibrancy on macOS.",
    icon: Palette,
    title: "Make it yours",
    wide: true,
  },
  {
    body: "Updates install themselves, and each one is verified as genuine before it does.",
    icon: Lock,
    title: "Safe auto-updates",
  },
];

const FeatureGrid = () => (
  <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {FEATURES.map(({ icon: Icon, title, body, wide }) => (
      <li
        key={title}
        className={`card group p-7 ${wide ? "lg:col-span-2" : ""}`}
      >
        <span className="bg-accent/10 text-accent ring-accent/20 group-hover:bg-accent/20 inline-flex size-10 items-center justify-center rounded-lg ring-1 transition group-hover:-translate-y-0.5">
          <Icon size={18} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-lg font-semibold">{title}</h3>
        <p className="text-muted mt-2 leading-7">{body}</p>
      </li>
    ))}
  </ul>
);

const PRIVACY = [
  {
    body: "Filex builds its list of your files on your computer, and that list stays there.",
    title: "The search index never leaves your computer",
  },
  {
    body: "Optional crash reports that help fix bugs, with file names, folders and searches removed first. And a check for updates. That's it.",
    title: "Exactly two kinds of network request",
  },
  {
    body: "Crash reports are on by default and you can turn them off in Settings. On Windows, the installer asks first. This website doesn't track you either.",
    title: "You're in control",
  },
] as const;

const Privacy = () => (
  <div className="card grid gap-10 p-8 sm:p-12 lg:grid-cols-[auto_1fr]">
    <span className="bg-accent/10 text-accent ring-accent/20 inline-flex size-14 items-center justify-center rounded-2xl ring-1">
      <ShieldCheck size={26} aria-hidden="true" />
    </span>
    <div>
      <ul className="grid gap-8 md:grid-cols-3">
        {PRIVACY.map(({ title, body }) => (
          <li key={title}>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-muted mt-2 text-sm leading-6">{body}</p>
          </li>
        ))}
      </ul>
      <Link
        to="/privacy"
        className="text-accent mt-8 inline-flex items-center gap-1.5 text-sm font-semibold"
      >
        Read the full privacy policy <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </div>
  </div>
);

const FinalCta = () => (
  <section className="relative overflow-hidden px-6 py-40 text-center">
    <div
      className="pointer-events-none absolute bottom-[-40%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.06),transparent)]"
      aria-hidden="true"
    />
    <div className="relative mx-auto flex max-w-2xl flex-col items-center">
      <AnimatedLogo className="w-20" />
      <h2 className="text-gradient mt-8 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-7xl">
        Stop waiting on your files.
      </h2>
      <p className="text-muted mt-5 text-lg leading-8">
        Free and open source, dual-licensed MIT / Apache-2.0. Read the code,
        report a bug or send a pull request on{" "}
        <a href={REPO_URL} className="text-text underline underline-offset-4">
          GitHub
        </a>
        .
      </p>
      <div className="mt-10">
        <DownloadButton />
      </div>
    </div>
  </section>
);

const HomePage = () => (
  <main>
    <Hero />

    <Section
      id="features"
      eyebrow="Built for speed"
      title="Every keystroke, answered instantly."
      lede="Filex is a real desktop app built for speed, not a website squeezed into a window. It opens in a blink and stays quick, however many files you have."
    >
      <Spotlight
        eyebrow="01 · Search"
        title="Instant filename search"
        body="Type part of a file's name and it shows up instantly, from anywhere on your computer. Even with 200,000 files, results arrive in under 2 milliseconds, and Filex keeps up as files are added, moved or deleted."
        visual={
          <Stage>
            <SearchVisual />
          </Stage>
        }
      />
      <Spotlight
        reverse
        eyebrow="02 · Filters"
        title="Filter chips"
        body={
          <>
            Narrow a search with chips and mix them with plain text, like{" "}
            <code>invoice ext:pdf modified:today</code>.
          </>
        }
        visual={
          <Stage>
            <ChipsVisual />
          </Stage>
        }
      />
      <Spotlight
        eyebrow="03 · Browsing"
        title="Huge folders, no lag"
        body="Open a folder with hundreds of thousands of files and scroll straight away. Filex only draws the rows you can see."
        visual={
          <Stage>
            <FolderVisual />
          </Stage>
        }
      />
      <FeatureGrid />
    </Section>

    <Section
      id="install"
      eyebrow="Install"
      title="Up and running in a minute."
      lede="One download per platform. After that, Filex keeps itself up to date."
    >
      <InstallSection />
    </Section>

    <Section
      id="privacy"
      eyebrow="Privacy"
      title="Private by design."
      lede="A file explorer sees everything on your disk. Filex keeps it there."
    >
      <Privacy />
    </Section>

    <FinalCta />
  </main>
);

export const Route = createFileRoute("/")({
  component: HomePage,
});
