import type { Meta, StoryObj } from "@storybook/html";

const createHeader = (): string => {
  return `
    <header style="padding: 1rem 1.5rem; background: white; position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <nav style="max-width: 960px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
        <h1 style="font-size: 1.5rem; margin: 0;">
          <a href="/" style="color: black; text-decoration: none;">&lt;MIFKATA /&gt;</a>
        </h1>
        <div style="display: flex; align-items: center; gap: 2rem;">
          <div style="display: flex; align-items: center; gap: 1.5rem; text-transform: uppercase;">
            <a href="/blog" style="color: #f97316; font-weight: 500; text-decoration: none;">
              <span style="font-size: 0.875rem; color: #6b7280;">01.</span> Blog
            </a>
            <a href="/about" style="color: #374151; text-decoration: none;">
              <span style="font-size: 0.875rem; color: #6b7280;">02.</span> About
            </a>
            <a href="/services" style="color: #374151; text-decoration: none;">
              <span style="font-size: 0.875rem; color: #6b7280;">03.</span> Services
            </a>
          </div>
          <a href="/resume" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: linear-gradient(to bottom right, #e8935f, #b85a38); color: #f8f0e3; border-radius: 0.25rem; text-decoration: none;">
            📄 Resume
          </a>
        </div>
      </nav>
    </header>
  `;
};

const meta: Meta = {
  title: "Components/Header",
  render: () => createHeader(),
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithContent: Story = {
  render: () => `
    ${createHeader()}
    <main style="max-width: 960px; margin: 0 auto; padding: 2rem;">
      <h2>Page Content</h2>
      <p>The header is sticky and stays at the top when scrolling.</p>
      <div style="height: 1000px; background: linear-gradient(to bottom, #f3f4f6, white);"></div>
    </main>
  `,
};
