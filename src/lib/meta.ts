export const meta = (title: string, description: string) => ({
  meta: [
    { title: `${title} — Meat Theory` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Meat Theory` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
