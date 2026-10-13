import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

import { markdownToHtml } from "./markdown";

const md = readFileSync(
  new URL("../content/PRIVACY.md", import.meta.url),
  "utf-8"
);
const html = markdownToHtml(md);

const words = (s: string) => s.split(/\s+/u).filter(Boolean);
const stripMarkdown = (s: string) =>
  s
    .replaceAll(/^#+ /gmu, "")
    .replaceAll(/^- /gmu, "")
    .replaceAll("**", "")
    .replaceAll("`", "")
    .replaceAll(/\[(?<text>[^\]]+)\]\([^)]+\)/gu, "$<text>");
const stripHtml = (s: string) =>
  s
    .replaceAll(/<\/?(?:p|h\d|ul|li)>/gu, " ")
    .replaceAll(/<[^>]+>/gu, "")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");

test("privacy policy renders word-for-word", () => {
  expect(words(stripHtml(html))).toEqual(words(stripMarkdown(md)));
});

test("privacy policy keeps its structure", () => {
  expect(html).toContain("<h1>Privacy policy</h1>");
  expect(html).toContain("<strong>Share anonymous diagnostics</strong>");
  expect(html).toContain("<code>filex-indexd</code>");
  expect(html).toContain(
    '<a href="https://github.com/NayanVR/Filex/blob/main/README.md#uninstall">Uninstall</a>'
  );
  expect(html.match(/<li>/gu)?.length).toBe(6);
});
