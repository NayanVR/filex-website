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

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-on-accent shadow-[0_0_0_1px_rgb(255_255_255/0.15)_inset,0_8px_30px_-6px_rgb(90_200_250/0.6)] transition hover:brightness-110";

const DownloadIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
export const DownloadButton = () => {
  const os = useOs();
  const assets = useAssets();

  if (os === "macos") {
    return (
      <div className="flex w-full max-w-xl flex-col items-center gap-2">
        <CopyCommand command={BREW_COMMAND} />
        <CopyCommand command={UNQUARANTINE_COMMAND} />
        <p className="text-muted text-sm text-pretty">
          macOS on Apple Silicon, via Homebrew. The second command lets macOS
          open Filex, which isn&apos;t notarized yet.
        </p>
      </div>
    );
  }

  const asset = os && assets[os];
  return (
    <div className="flex flex-col items-center gap-2">
      <a className={buttonClass} href={asset?.url ?? RELEASES_URL}>
        <DownloadIcon />
        {os ? `Download for ${OS_LABEL[os]}` : "Download Filex"}
      </a>
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
    <div className="grid gap-4 md:grid-cols-3">
      <article id="windows" className="card flex flex-col gap-4 p-7">
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

      <article id="macos" className="card flex flex-col gap-4 p-7">
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

      <article id="linux" className="card flex flex-col gap-4 p-7">
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
