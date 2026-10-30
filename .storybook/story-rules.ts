// The framework renders Astro components in its own Vite server, which never
// sees the aliases in main.ts, so a story that reads content needs the mock
// applied here.
export default {
  rules: [
    {
      match: "post-articleseries--*",
      use: ({ mock }: { mock: (id: string, to: string) => void }) => {
        mock("astro:content", "./mocks/astro-content.ts");
      },
    },
  ],
};
