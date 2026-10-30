import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { useOs } from "@/lib/release";

/**
 * The app's default shortcuts (filex/src/workspace/shortcuts.rs), laid out like its Keyboard settings.
 * Pressing a listed combination lights its row; the page never intercepts the key.
 */

interface Shortcut {
  label: string;
  mac: string;
  other: string;
}

const GROUPS: readonly { name: string; items: readonly Shortcut[] }[] = [
  {
    items: [
      { label: "Focus search", mac: "cmd-k", other: "ctrl-k" },
      { label: "Edit path", mac: "cmd-l", other: "ctrl-l" },
      { label: "Go back", mac: "cmd-[", other: "alt-left" },
      { label: "Go forward", mac: "cmd-]", other: "alt-right" },
      { label: "Parent folder", mac: "cmd-up", other: "alt-up" },
    ],
    name: "Navigation",
  },
  {
    items: [
      { label: "Open selected item", mac: "enter", other: "enter" },
      { label: "Rename", mac: "f2", other: "f2" },
      { label: "Copy as path", mac: "cmd-alt-c", other: "ctrl-shift-c" },
      { label: "Move to Trash", mac: "cmd-backspace", other: "ctrl-delete" },
      { label: "Undo file operation", mac: "cmd-z", other: "ctrl-z" },
    ],
    name: "Selection and files",
  },
  {
    items: [
      { label: "Switch list / grid", mac: "v", other: "v" },
      { label: "Preview selected files", mac: "space", other: "space" },
      { label: "Toggle details", mac: "cmd-i", other: "ctrl-i" },
      { label: "Keyboard settings", mac: "shift-/", other: "shift-/" },
    ],
    name: "View",
  },
  {
    items: [
      { label: "New tab", mac: "cmd-t", other: "ctrl-t" },
      { label: "Close tab", mac: "cmd-w", other: "ctrl-w" },
      { label: "Next tab", mac: "ctrl-tab", other: "ctrl-tab" },
    ],
    name: "Tabs",
  },
];

const MAC_CAPS: Record<string, string> = {
  alt: "⌥",
  backspace: "⌫",
  cmd: "⌘",
  ctrl: "⌃",
  shift: "⇧",
};

const CAPS: Record<string, string> = {
  alt: "Alt",
  backspace: "Backspace",
  ctrl: "Ctrl",
  delete: "Delete",
  enter: "Enter",
  f2: "F2",
  left: "←",
  right: "→",
  shift: "Shift",
  space: "Space",
  tab: "Tab",
  up: "↑",
};

const caps = (binding: string, mac: boolean): string[] => {
  // "shift-/" is how the app spells "?".
  if (binding === "shift-/") {
    return ["?"];
  }
  return binding
    .split("-")
    .map((part) => (mac && MAC_CAPS[part]) || CAPS[part] || part.toUpperCase());
};

const CODE_KEYS: Record<string, string> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  Backspace: "backspace",
  BracketLeft: "[",
  BracketRight: "]",
  Delete: "delete",
  Enter: "enter",
  F2: "f2",
  Slash: "/",
  Space: "space",
  Tab: "tab",
};

const LETTER_CODE = /^Key(?<letter>[A-Z])$/u;
const TEXT_FIELDS = new Set(["INPUT", "SELECT", "TEXTAREA"]);
const LIT_MS = 900;

/** The pressed combination in the app's binding syntax, e.g. "cmd-alt-c". */
const bindingOf = (event: KeyboardEvent): string => {
  const key =
    CODE_KEYS[event.code] ??
    LETTER_CODE.exec(event.code)?.groups?.letter?.toLowerCase() ??
    "";
  const mods = [
    event.metaKey && "cmd",
    event.ctrlKey && "ctrl",
    event.altKey && "alt",
    event.shiftKey && "shift",
  ].filter(Boolean);
  return [...mods, key].join("-");
};

const Caps = ({
  binding,
  mac,
  lit,
}: {
  binding: string;
  mac: boolean;
  lit: boolean;
}) => (
  <span className="flex gap-1">
    {caps(binding, mac).map((cap) => (
      <kbd
        key={cap}
        className={`font-ui min-w-[2.1em] px-2 py-1 text-center text-[15px] transition-colors duration-200 ${lit ? "bg-accent text-on-accent" : ""}`}
      >
        {cap}
      </kbd>
    ))}
  </span>
);

/** Lit row in the app's selection colour, otherwise the list's zebra stripes. */
const rowTint = (isLit: boolean, index: number): string => {
  if (isLit) {
    return "bg-[#203a4a]";
  }
  return index % 2 ? "" : "bg-panel";
};

export const Keyboard = () => {
  const os = useOs();
  const [choice, setChoice] = useState<"mac" | "other" | null>(null);
  const platform = choice ?? (os && os !== "macos" ? "other" : "mac");
  const mac = platform === "mac";
  const [lit, setLit] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onKey = (event: KeyboardEvent) => {
      const { target } = event;
      if (target instanceof HTMLElement && TEXT_FIELDS.has(target.tagName)) {
        return;
      }
      setLit(bindingOf(event));
      clearTimeout(timer);
      timer = setTimeout(() => setLit(null), LIT_MS);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="keyboard"
      aria-labelledby="keyboard-title"
      className="frame grid scroll-mt-8 gap-12 py-[clamp(96px,12vw,200px)] lg:grid-cols-12 lg:gap-6"
    >
      <div className="lg:col-span-4">
        <div className="flex flex-col items-start gap-8 lg:sticky lg:top-12">
          <h2
            id="keyboard-title"
            className="text-head max-w-[10ch]"
            data-reveal
          >
            Every action has a key.
          </h2>
          <p
            className="max-w-[34ch]"
            data-reveal
            style={{ "--i": 1 } as CSSProperties}
          >
            These are the defaults, and you can remap any of them in Settings.
            Press one and watch its row light up.
          </p>
          <fieldset className="bg-panel inline-flex rounded-xl p-1">
            <legend className="sr-only">Show shortcuts for</legend>
            {(
              [
                ["mac", "macOS"],
                ["other", "Windows and Linux"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={platform === value}
                onClick={() => setChoice(value)}
                className={`rounded-lg px-4 py-2 text-[15px] transition-colors ${platform === value ? "bg-raised font-semibold" : "text-muted hover:text-text"}`}
              >
                {label}
              </button>
            ))}
          </fieldset>
        </div>
      </div>

      <div className="gap-6 md:columns-2 lg:col-span-8">
        {GROUPS.map(({ name, items }, groupIndex) => (
          <div
            key={name}
            className="mb-12 break-inside-avoid"
            data-reveal
            style={{ "--i": groupIndex % 2 } as CSSProperties}
          >
            <h3 className="text-lead mb-4">{name}</h3>
            <ul>
              {items.map((item, index) => {
                const binding = mac ? item.mac : item.other;
                const isLit = lit === binding;
                return (
                  <li
                    key={item.label}
                    className={`flex items-center justify-between gap-4 rounded-lg px-4 py-3 transition-colors duration-200 ${rowTint(isLit, index)}`}
                  >
                    {item.label}
                    <Caps binding={binding} mac={mac} lit={isLit} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
