import { useState } from "react";
import type { ReactNode } from "react";

import type { Os } from "@/lib/release";
import {
  BREW_COMMAND,
  RELEASES_URL,
  UNQUARANTINE_COMMAND,
  useAssets,
  useOs,
} from "@/lib/release";

const OS_LABEL: Record<Os, string> = {
  linux: "Linux",
  macos: "macOS",
  windows: "Windows",
};
const COPIED_MS = 1500;

const buttonBase =
  "group inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-5 py-3 font-semibold whitespace-nowrap transition active:scale-[0.97]";
export const secondaryButtonClass = `${buttonBase} border-line bg-white/[0.03] text-text hover:bg-white/[0.07]`;
const buttonClass = `${buttonBase} bg-text text-bg shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_8px_24px_-8px_rgb(255_255_255/0.25)] hover:bg-white`;

const DownloadIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="transition group-hover:translate-y-0.5"
    aria-hidden="true"
  >
    <path
      d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CopyCommand = ({ command }: { command: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // Clipboard blocked: the command is still selectable.
    }
  };
  return (
    <div className="border-line bg-panel flex w-full items-center gap-2 rounded-lg border py-1.5 pr-1.5 pl-3 text-left font-mono text-sm">
      <span className="text-muted select-none" aria-hidden="true">
        $
      </span>
      <code className="min-w-0 flex-1 border-0 bg-transparent p-0 break-words">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        className="text-muted hover:bg-line hover:text-text rounded-md px-2.5 py-1 font-sans text-xs font-semibold"
      >
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
};

/** Hero call to action: picks the visitor's OS once the page is in the browser. */
export const DownloadButton = ({ secondary }: { secondary?: ReactNode }) => {
  const os = useOs();
  const assets = useAssets();

  // No direct macOS download: Homebrew instructions live on /download.
  const href =
    os === "macos"
      ? "/download#macos"
      : ((os && assets[os]?.url) ?? RELEASES_URL);
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Equal-width columns keep both buttons the same size, side by side. */}
      <div className="grid w-full gap-3 sm:auto-cols-fr sm:grid-flow-col">
        <a className={buttonClass} href={href}>
          <DownloadIcon />
          {os ? `Download for ${OS_LABEL[os]}` : "Download Filex"}
        </a>
        {secondary}
      </div>
      <p className="text-muted text-sm">
        {assets.version ? `v${assets.version} · ` : ""}
        Windows, macOS and Linux ·{" "}
        <a
          href="#install"
          className="hover:text-text underline underline-offset-2"
        >
          all platforms
        </a>
      </p>
    </div>
  );
};

const Prompt = ({ children }: { children: ReactNode }) => (
  <p className="border-line text-muted mt-auto border-t pt-4 text-sm leading-6">
    {children}
  </p>
);

/** Explicit per-platform instructions. Used on the home page and /download. */
export const InstallSection = () => {
  const assets = useAssets();
  const msi = assets.windows?.name ?? "Filex-<version>-x64.msi";
  const tarball = assets.linux?.name ?? "filex-<version>-linux-x86_64.tar.gz";

  return (
    <div className="lit-grid md:grid-cols-3">
      <article id="windows" className="flex min-w-0 flex-col gap-4 p-8">
        <h3 className="text-lg font-semibold">
          Windows <span className="text-muted text-sm font-normal">x64</span>
        </h3>
        <a className={buttonClass} href={assets.windows?.url ?? RELEASES_URL}>
          <DownloadIcon />
          Download installer
        </a>
        <p className="text-muted text-sm leading-6">
          Run <code>{msi}</code>. Later updates install silently.
        </p>
        <Prompt>
          The installer isn&apos;t code-signed yet, so SmartScreen warns you
          once. Click <strong>More info</strong>, then{" "}
          <strong>Run anyway</strong>.
        </Prompt>
      </article>

      <article id="macos" className="flex min-w-0 flex-col gap-4 p-8">
        <h3 className="text-lg font-semibold">
          macOS{" "}
          <span className="text-muted text-sm font-normal">Apple Silicon</span>
        </h3>
        <CopyCommand command={BREW_COMMAND} />
        <p className="text-muted text-sm leading-6">
          Installs with Homebrew. Filex keeps itself up to date after that. Then
          run this so macOS lets Filex open:
        </p>
        <CopyCommand command={UNQUARANTINE_COMMAND} />
        <Prompt>
          Filex isn&apos;t notarized yet, so macOS blocks it until you run the
          command above. Or skip it: on first launch, open{" "}
          <strong>System Settings → Privacy &amp; Security</strong> and click{" "}
          <strong>Open Anyway</strong>.
        </Prompt>
      </article>

      <article id="linux" className="flex min-w-0 flex-col gap-4 p-8">
        <h3 className="text-lg font-semibold">
          Linux <span className="text-muted text-sm font-normal">x86_64</span>
        </h3>
        <a className={buttonClass} href={assets.linux?.url ?? RELEASES_URL}>
          <DownloadIcon />
          Download tarball
        </a>
        <p className="text-muted text-sm leading-6">
          Extract <code>{tarball}</code> and put <code>filex</code> and{" "}
          <code>filex-indexd</code> together on your <code>PATH</code>, for
          example:
        </p>
        <pre className="border-line bg-bg overflow-x-auto rounded-lg border p-3 font-mono text-xs leading-5">
          {`tar -xzf ${tarball}\ninstall -m 755 filex filex-indexd ~/.local/bin/`}
        </pre>
        <Prompt>There&apos;s no AppImage or distro package yet.</Prompt>
      </article>
    </div>
  );
};
