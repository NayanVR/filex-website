import { createFileRoute } from "@tanstack/react-router";

import { InstallSection } from "@/components/download";
import { RELEASES_URL } from "@/lib/release";

const DownloadPage = () => (
  <main className="mx-auto max-w-6xl px-6 py-16">
    <h1 className="text-3xl font-semibold tracking-tight">Download Filex</h1>
    <p className="text-muted mt-3 mb-10 max-w-2xl">
      Free and open source. Pick your platform below, or browse every file on
      the{" "}
      <a
        href={RELEASES_URL}
        className="text-accent underline underline-offset-2"
      >
        latest release
      </a>
      .
    </p>
    <h2 className="sr-only">Platforms</h2>
    <InstallSection />
  </main>
);

export const Route = createFileRoute("/download")({
  component: DownloadPage,
  head: () => ({
    meta: [
      { title: "Download · Filex" },
      {
        content: "Download Filex for Windows, macOS or Linux.",
        name: "description",
      },
    ],
  }),
});
