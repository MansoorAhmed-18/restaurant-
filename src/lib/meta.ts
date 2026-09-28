export const meta = (title: string, description: string) => ({
  meta: [
    { title: `${title} — Tan's Kitchen` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} —  Tan's Kitchen` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
