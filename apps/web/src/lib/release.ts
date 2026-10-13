import { useEffect, useState, useSyncExternalStore } from "react";

export const REPO_URL = "https://github.com/NayanVR/Filex";
export const RELEASES_URL = `${REPO_URL}/releases/latest`;
export const BREW_COMMAND = "brew install --cask NayanVR/filex/filex";
// Filex isn't notarized, so Gatekeeper blocks a quarantined first launch; this clears the flag.
export const UNQUARANTINE_COMMAND =
  "xattr -dr com.apple.quarantine /Applications/Filex.app";
const LATEST_API = "https://api.github.com/repos/NayanVR/Filex/releases/latest";

export type Os = "windows" | "macos" | "linux";

interface Asset {
  name: string;
  url: string;
}

export interface Assets {
  version?: string;
  windows?: Asset;
  linux?: Asset;
}

interface GithubRelease {
  tag_name: string;
  assets: { name: string; browser_download_url: string }[];
}

const MSI = /-x64\.msi$/u;
const LINUX_TARBALL = /-linux-x86_64\.tar\.gz$/u;
const MOBILE = /Android|iPhone|iPad|iPod|CrOS/u;

export const detectOs = (ua: string): Os | null => {
  if (MOBILE.test(ua)) {
    return null;
  }
  if (ua.includes("Windows")) {
    return "windows";
  }
  if (ua.includes("Mac")) {
    return "macos";
  }
  if (ua.includes("Linux")) {
    return "linux";
  }
  return null;
};

export const pickAssets = (release: GithubRelease): Assets => {
  const find = (re: RegExp): Asset | undefined => {
    const asset = release.assets.find(({ name }) => re.test(name));
    return asset && { name: asset.name, url: asset.browser_download_url };
  };
  return {
    linux: find(LINUX_TARBALL),
    version: release.tag_name.replace(/^v/u, ""),
    windows: find(MSI),
  };
};

const fetchAssets = async (): Promise<Assets> => {
  try {
    const res = await fetch(LATEST_API, {
      headers: { Accept: "application/vnd.github+json" },
    });
    return res.ok ? pickAssets(await res.json()) : {};
  } catch {
    // Offline or rate-limited: links keep pointing at the Releases page.
    return {};
  }
};

// One request per page load, shared by every component that asks.
let pending: Promise<Assets> | undefined;

/** Latest release assets, resolved in the browser. Empty until (and unless) GitHub answers. */
export const useAssets = (): Assets => {
  const [assets, setAssets] = useState<Assets>({});
  useEffect(() => {
    let live = true;
    const load = async () => {
      if (!pending) {
        pending = fetchAssets();
      }
      const resolved = await pending;
      if (live) {
        setAssets(resolved);
      }
    };
    load();
    return () => {
      live = false;
    };
  }, []);
  return assets;
};

const noSubscribe = () => () => {
  // The UA never changes while the page is open, so there is nothing to unsubscribe.
};

/** Visitor's desktop OS; null during prerender and on mobile. */
export const useOs = (): Os | null =>
  useSyncExternalStore(
    noSubscribe,
    () => detectOs(navigator.userAgent),
    () => null
  );
