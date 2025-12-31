import type { Meta, StoryObj } from "@storybook/html";

const createCodeBlock = (code: string, language: string): string => {
  return `
    <div style="position: relative;" class="group">
      <pre style="background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0;">
<code class="language-${language}">${code}</code></pre>
      <button
        style="position: absolute; top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; background: #374151; color: #d1d5db; border: none; border-radius: 0.25rem; cursor: pointer; opacity: 0.7;"
        onmouseover="this.style.opacity='1'; this.style.background='#4b5563';"
        onmouseout="this.style.opacity='0.7'; this.style.background='#374151';"
        onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000);"
      >Copy</button>
    </div>
  `;
};

const meta: Meta = {
  title: "Components/CodeCopyButton",
  render: () =>
    createCodeBlock(
      `function greet(name) {\n  return \`Hello, \${name}!\`;\n}`,
      "javascript",
    ),
};

export default meta;
type Story = StoryObj;

export const JavaScript: Story = {
  render: () =>
    createCodeBlock(
      `function greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
      "javascript",
    ),
};

export const TypeScript: Story = {
  render: () =>
    createCodeBlock(
      `interface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = {\n  name: "Alice",\n  age: 30,\n};`,
      "typescript",
    ),
};

export const Bash: Story = {
  render: () =>
    createCodeBlock(
      `#!/bin/bash\n\necho "Installing dependencies..."\nnpm install\n\necho "Building project..."\nnpm run build`,
      "bash",
    ),
};

export const MultipleBlocks: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${createCodeBlock(`const x = 1;`, "javascript")}
      ${createCodeBlock(`npm install astro`, "bash")}
      ${createCodeBlock(`SELECT * FROM users;`, "sql")}
    </div>
  `,
};
