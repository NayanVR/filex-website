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

/** The page's one button: solid accent, the page's corner radius, a small lift on hover. */
export const PrimaryButton = ({
  href,
  children,
  size = "base",
}: {
  href: string;
  children: ReactNode;
  size?: "base" | "large";
}) => (
  <a
    href={href}
    className={`bg-accent text-on-accent inline-flex w-fit items-center rounded-xl font-semibold whitespace-nowrap transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#7fd6fb] active:translate-y-0 active:scale-[0.98] ${size === "large" ? "text-lead px-8 py-4" : "px-5 py-3"}`}
  >
    {children}
  </a>
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
    <div className="bg-raised flex w-full items-start gap-2 rounded-[10px] py-2 pr-2 pl-3.5">
      <code className="min-w-0 flex-1 bg-transparent px-0 py-1 text-[14px] break-words">
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        className="hover:bg-panel active:bg-bg rounded-md px-2.5 py-1 text-[14px] font-semibold transition-colors"
      >
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
};

/** Main call to action: picks the visitor's OS once the page is in the browser. */
export const DownloadButton = ({ size }: { size?: "base" | "large" }) => {
  const os = useOs();
  const assets = useAssets();

  // No direct macOS download: Homebrew instructions live on /download.
  const href =
    os === "macos"
      ? "/download#macos"
      : ((os && assets[os]?.url) ?? RELEASES_URL);
  return (
    <PrimaryButton href={href} size={size}>
      {os ? `Download for ${OS_LABEL[os]}` : "Download Filex"}
    </PrimaryButton>
  );
};

const Platform = ({
  id,
  name,
  arch,
  children,
}: {
  id: Os;
  name: string;
  arch: string;
  children: ReactNode;
}) => (
  <article
    id={id}
    className="flex min-w-0 scroll-mt-8 flex-col gap-4"
    data-reveal
  >
    <h3 className="text-lead flex items-baseline gap-3">
      {name} <span className="text-muted text-body font-normal">{arch}</span>
    </h3>
    {children}
  </article>
);

const Note = ({ children }: { children: ReactNode }) => (
  <p className="text-muted text-[15px] leading-6">{children}</p>
);

/** Explicit per-platform instructions. Used on the home page and /download. */
export const InstallSection = () => {
  const assets = useAssets();
  const msi = assets.windows?.name ?? "Filex-<version>-x64.msi";
  const tarball = assets.linux?.name ?? "filex-<version>-linux-x86_64.tar.gz";

  return (
    <div className="grid gap-x-10 gap-y-16 lg:grid-cols-3">
      <Platform id="windows" name="Windows" arch="x64">
        <PrimaryButton href={assets.windows?.url ?? RELEASES_URL}>
          Download installer
        </PrimaryButton>
        <p>
          Run <code>{msi}</code>. Later updates install themselves.
        </p>
        <Note>
          The installer isn&apos;t code-signed yet, so SmartScreen warns you
          once. Click <strong>More info</strong>, then{" "}
          <strong>Run anyway</strong>.
        </Note>
      </Platform>

      <Platform id="macos" name="macOS" arch="Apple Silicon">
        <CopyCommand command={BREW_COMMAND} />
        <p>Installs with Homebrew. Then run this so macOS lets Filex open:</p>
        <CopyCommand command={UNQUARANTINE_COMMAND} />
        <Note>
          Filex isn&apos;t notarized yet. Instead of the command, you can open{" "}
          <strong>System Settings → Privacy &amp; Security</strong> on first
          launch and click <strong>Open Anyway</strong>.
        </Note>
      </Platform>

      <Platform id="linux" name="Linux" arch="x86_64">
        <PrimaryButton href={assets.linux?.url ?? RELEASES_URL}>
          Download tarball
        </PrimaryButton>
        <p>
          Extract it and put <code>filex</code> and <code>filex-indexd</code>{" "}
          together on your <code>PATH</code>:
        </p>
        <pre className="bg-raised overflow-x-auto rounded-[10px] p-3.5 font-mono text-[14px] leading-6">
          {`tar -xzf ${tarball}\ninstall -m 755 filex filex-indexd ~/.local/bin/`}
        </pre>
        <Note>There&apos;s no AppImage or distro package yet.</Note>
      </Platform>
    </div>
  );
};
