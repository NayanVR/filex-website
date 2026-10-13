// Minimal Markdown → HTML for PRIVACY.md: headings, paragraphs, "-" lists,
// **bold**, `code` and [links]. ponytail: add a real parser if the policy grows tables or nesting.

const REPO_BLOB = "https://github.com/NayanVR/Filex/blob/main/";
const ABSOLUTE = /^https?:/u;
const CODE = /`(?<code>[^`]+)`/gu;
const BOLD = /\*\*(?<bold>[^*]+)\*\*/gu;
const LINK = /\[(?<text>[^\]]+)\]\((?<href>[^)]+)\)/gu;
const HEADING = /^(?<hashes>#{1,6}) (?<title>.*)$/u;
const BLANK_LINE = /\n\s*\n/u;

const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const inline = (s: string) =>
  escape(s)
    .replace(CODE, "<code>$<code></code>")
    .replace(BOLD, "<strong>$<bold></strong>")
    .replace(LINK, (_match, text: string, href: string) => {
      const url = ABSOLUTE.test(href) ? href : REPO_BLOB + href;
      return `<a href="${url}">${text}</a>`;
    });

const block = (text: string) => {
  const lines = text.split("\n");
  const heading = HEADING.exec(text);
  if (heading?.groups && lines.length === 1) {
    const level = heading.groups.hashes.length;
    return `<h${level}>${inline(heading.groups.title)}</h${level}>`;
  }
  if (lines[0].startsWith("- ")) {
    const items: string[] = [];
    for (const line of lines) {
      if (line.startsWith("- ")) {
        items.push(line.slice(2));
      } else {
        items[items.length - 1] += ` ${line.trim()}`;
      }
    }
    return `<ul>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`;
  }
  return `<p>${inline(lines.map((l) => l.trim()).join(" "))}</p>`;
};

export const markdownToHtml = (md: string): string =>
  md
    .replaceAll("\r\n", "\n")
    .split(BLANK_LINE)
    .map((b) => b.trim())
    .filter(Boolean)
    .map(block)
    .join("\n");
