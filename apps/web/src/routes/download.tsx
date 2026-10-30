import { createFileRoute } from "@tanstack/react-router";

import { InstallSection } from "@/components/download";
import { RELEASES_URL } from "@/lib/release";

const DownloadPage = () => (
  <main className="frame pt-16 pb-[clamp(96px,12vw,200px)]">
    <h1 className="text-display leading-[0.98]">Download Filex</h1>
    <p className="text-lead mt-8 mb-20 max-w-[40ch]">
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
