export const meta = (title: string, description: string) => ({
  meta: [
    { title: `${title} — Tadka POS` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Tadka POS` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
