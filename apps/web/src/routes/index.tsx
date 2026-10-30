import { Link, createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";

import { AppWindow } from "@/components/app-window";
import { DownloadButton, InstallSection } from "@/components/download";
import { Folder } from "@/components/folder";
import { Keyboard } from "@/components/keyboard";
import { Showcase } from "@/components/showcase";
import { REPO_URL, useAssets } from "@/lib/release";

const order = (i: number) => ({ "--i": i }) as CSSProperties;

const Hero = () => {
  const { version } = useAssets();
  return (
    <section className="frame grid gap-10 pt-[clamp(24px,5vw,72px)] pb-[clamp(32px,4vw,64px)] lg:grid-cols-12 lg:items-center lg:gap-6">
      <div className="flex min-w-0 flex-col items-start lg:col-span-5">
        <h1 className="text-display max-w-[9ch] leading-[0.98]">
          Find any file as you type.
        </h1>
        <p className="text-lead rise mt-10 max-w-[30ch]" style={order(1)}>
          Filex is a fast, native file explorer for Windows, macOS and Linux.
          Search covers every filename on your drives.
        </p>
        <div
          className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          style={order(2)}
        >
          <DownloadButton />
        </div>
        <p className="text-muted rise mt-6 text-[15px]" style={order(3)}>
          Free and open source{version ? ` · version ${version}` : ""}
        </p>
      </div>

      {/* The motif at full scale: a deep-blue folder holding the live search. */}
      <div className="rise min-w-0 lg:col-span-7" style={order(2)}>
        <Folder
          fill="var(--deep)"
          style={{ "--tab-w": "42%" } as CSSProperties}
          bodyClassName="p-[clamp(12px,2.2vw,32px)]"
        >
          <AppWindow />
        </Folder>
      </div>
    </section>
  );
};

const SettingRow = ({
  label,
  note,
  on,
}: {
  label: string;
  note: string;
  on?: boolean;
}) => (
  <div className="flex items-start gap-4 py-3">
    <div className="min-w-0 flex-1">
      <p className="font-semibold">{label}</p>
      <p className="text-[#a3a7b0]">{note}</p>
    </div>
    {on !== undefined && (
      <span
        className={`mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 ${on ? "justify-end bg-[#5ac8fa]" : "bg-white/15"}`}
      >
        <span className="size-5 rounded-full bg-white" />
      </span>
    )}
  </div>
);

/** The app's Settings › Privacy pane, whole, in a sky folder. */
const SettingsPane = () => (
  <Folder
    fill="#28bdfc"
    bodyClassName="p-[clamp(12px,2.2vw,32px)]"
    style={{ "--tab-w": "40%" } as CSSProperties}
  >
    <div
      data-ui
      className="font-ui rounded-[14px] bg-[#1c1d21] text-[14px] text-[#ececef]"
    >
      <p className="flex h-10 items-center gap-2 rounded-t-[14px] bg-[#131416] px-4 text-[#a3a7b0]">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3">Settings › Privacy</span>
      </p>
      <div className="px-5 pt-2 pb-4">
        <SettingRow
          on
          label="Send crash reports"
          note="Never includes file names or searches."
        />
        <SettingRow
          label="Check for updates"
          note="Every update is signed and verified."
        />
        <SettingRow label="Search index" note="Stays on this computer." />
      </div>
    </div>
  </Folder>
);

const Privacy = () => (
  <section
    id="privacy"
    aria-labelledby="privacy-title"
    className="mx-[clamp(10px,1.4vw,20px)] grid scroll-mt-8 gap-14 rounded-[var(--r)] bg-[#002d71] p-[clamp(20px,4vw,64px)] text-[#e6f1ff] lg:grid-cols-12 lg:gap-6"
  >
    <div className="flex flex-col items-start gap-10 lg:col-span-5">
      <h2 id="privacy-title" className="text-head max-w-[12ch]" data-reveal>
        Your files stay yours.
      </h2>
      <p className="text-lead max-w-[30ch]" data-reveal style={order(1)}>
        Your file index never leaves your computer. Filex only goes online to
        check for updates and, if you allow it, send crash reports.
      </p>
      <Link
        to="/privacy"
        className="font-semibold underline decoration-2 underline-offset-[6px] transition-colors hover:text-[#5ac8fa]"
      >
        Read the privacy policy
      </Link>
    </div>
    <div
      className="lg:col-span-6 lg:col-start-7 lg:self-center"
      data-reveal
      style={order(2)}
    >
      <SettingsPane />
    </div>
  </section>
);

const Section = ({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede: string;
  children: ReactNode;
}) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="frame scroll-mt-8 py-[clamp(96px,12vw,200px)]"
  >
    <div className="mb-16 grid gap-6 lg:grid-cols-12">
      <h2 id={`${id}-title`} className="text-head lg:col-span-7" data-reveal>
        {title}
      </h2>
      <p
        className="text-lead lg:col-span-4 lg:col-start-9 lg:self-end"
        data-reveal
        style={order(1)}
      >
        {lede}
      </p>
    </div>
    {children}
  </section>
);

// The app's own last onboarding screen (filex/src/workspace/onboarding.rs).
const ONBOARDING_KEYS = [
  { keys: ["⌘", "K"], label: "Search everything, from anywhere" },
  { keys: ["Space"], label: "Peek at a file without opening it" },
  { keys: ["?"], label: "See every shortcut" },
] as const;

const AllSet = () => (
  <Folder
    fill="var(--deep)"
    bodyClassName="p-[clamp(12px,2.2vw,32px)]"
    style={{ "--tab-w": "40%" } as CSSProperties}
  >
    <div
      data-ui
      className="font-ui rounded-[14px] bg-[#1c1d21] px-[clamp(20px,3vw,40px)] py-[clamp(24px,3.4vw,48px)] text-[15px] text-[#ececef]"
    >
      <p className="text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.01em]">
        You&apos;re all set.
      </p>
      <p className="mt-1 text-[#a3a7b0]">Three keys get you most of the way.</p>
      <ul className="mt-6 flex flex-col gap-1">
        {ONBOARDING_KEYS.map(({ keys, label }, index) => (
          <li
            key={label}
            className={`flex items-center gap-4 rounded-lg px-3 py-2.5 ${index % 2 ? "" : "bg-[#222328]"}`}
          >
            <span className="flex w-20 shrink-0 gap-1">
              {keys.map((key) => (
                <kbd
                  key={key}
                  className="font-ui bg-[#2e3036] px-2 py-0.5 text-[14px]"
                >
                  {key}
                </kbd>
              ))}
            </span>
            {label}
          </li>
        ))}
      </ul>
      <p className="mt-6 flex justify-end">
        <span className="rounded-lg bg-[#5ac8fa] px-4 py-2 font-semibold text-[#131416]">
          Start exploring ↵
        </span>
      </p>
    </div>
  </Folder>
);

const Closing = () => (
  <section
    aria-labelledby="closing-title"
    className="frame grid items-center gap-14 py-[clamp(120px,14vw,240px)] lg:grid-cols-12 lg:gap-6"
  >
    <div className="flex flex-col items-start lg:col-span-5" data-reveal>
      <h2
        id="closing-title"
        className="text-display max-w-[11ch] leading-[0.98]"
      >
        Stop waiting on your files.
      </h2>
      <p className="mt-8 max-w-[40ch]">
        Free and open source, dual-licensed MIT / Apache-2.0. Read the code,
        report a bug or send a pull request on{" "}
        <a
          href={REPO_URL}
          className="hover:text-accent underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
      <div className="mt-10">
        <DownloadButton size="large" />
      </div>
    </div>
    <div className="lg:col-span-6 lg:col-start-7" data-reveal style={order(1)}>
      <AllSet />
    </div>
  </section>
);

const HomePage = () => (
  <main className="overflow-x-clip">
    <Hero />
    <Showcase />
    <Keyboard />
    <Section
      id="install"
      title="Up and running in a minute."
      lede="One download per platform. After that, Filex keeps itself up to date."
    >
      <InstallSection />
    </Section>
    <Privacy />
    <Closing />
  </main>
);

export const Route = createFileRoute("/")({
  component: HomePage,
});
