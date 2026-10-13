// oxlint-disable react/no-danger -- trusted, bundled Markdown rendered word-for-word
import { createFileRoute } from "@tanstack/react-router";

import privacyMd from "@/content/PRIVACY.md?raw";
import { markdownToHtml } from "@/lib/markdown";

// PRIVACY.md is copied verbatim from the Filex repo; replace the file to update this page.
const policyHtml = markdownToHtml(privacyMd);

const PrivacyPage = () => (
  <main className="mx-auto max-w-2xl px-6 py-16">
    <article
      className="prose-policy"
      dangerouslySetInnerHTML={{ __html: policyHtml }}
    />
  </main>
);

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy policy · Filex" },
      {
        content: "What Filex sends over the network, and how to turn it off.",
        name: "description",
      },
    ],
  }),
});
