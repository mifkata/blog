import type { Meta, StoryObj } from "@storybook/html";

const createFooter = (): string => {
  const year = new Date().getFullYear();
  const lastUpdated = new Date().toISOString().split("T")[0];

  return `
    <footer style="padding: 1.5rem; font-size: 0.875rem; color: #374151; background: linear-gradient(to top, rgba(55,65,81,0.1), transparent); border-top: 1px solid rgba(229,231,235,0.5);">
      <div style="max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr auto; gap: 1.5rem; text-align: left;">
        <div style="space-y: 0.25rem;">
          <p style="margin: 0;">👨‍💻 © ${year} Andriyan Ivanov</p>
          <p style="margin: 0;">🛠️ Full-stack engineer (Backend · Frontend · DevOps · QA)</p>
          <p style="margin: 0.5rem 0 0; font-style: italic;">💭 "The problem with the world is that the intelligent people are full of doubts, while the stupid ones are full of confidence." — Charles Bukowski</p>
          <p style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
            ✉️ <a href="mailto:hi@mifkata.com" style="color: inherit;">hi@mifkata.com</a>
          </p>
        </div>
        <div>
          <p style="margin: 0;">📚 Currently learning: <a href="https://elixir-lang.org" style="color: #f97316;">Elixir</a></p>
          <p style="margin: 0;">🏷️ <a href="/tags" style="color: inherit;">Tags</a> · <a href="/sitemap-index.xml" style="color: inherit;">Sitemap</a> · <a href="/rss.xml" style="color: inherit;">RSS</a></p>
          <p style="margin: 0;">🔥 Footer reached? Respect!</p>
          <p style="margin: 0;">🚀 Last updated: ${lastUpdated} · Built with <a href="https://astro.build" style="color: #f97316;">Astro</a></p>
        </div>
        <pre style="font-family: monospace; font-size: 0.75rem; color: #6b7280; margin: 0; line-height: 1;">
 /\\_/\\
( o.o )
 > ^ <</pre>
      </div>
    </footer>
  `;
};

const meta: Meta = {
  title: "Components/Footer",
  render: () => createFooter(),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithPage: Story = {
  render: () => `
    <div style="min-height: 100vh; display: flex; flex-direction: column;">
      <main style="flex: 1; max-width: 960px; margin: 0 auto; padding: 2rem;">
        <h2>Page Content</h2>
        <p>Footer appears at the bottom of the page.</p>
      </main>
      ${createFooter()}
    </div>
  `,
};
