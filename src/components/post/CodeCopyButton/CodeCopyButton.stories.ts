import type { Meta, StoryObj } from "@storybook/html";
import { initCodeCopyButtons } from "./codeCopy";

// CodeCopyButton is a script-only component that auto-attaches to <pre> elements

const meta: Meta = {
  title: "Post/CodeCopyButton",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "CodeCopyButton automatically attaches copy buttons to all <pre> elements on the page.",
      },
    },
  },
  decorators: [
    (storyFn) => {
      const result = storyFn();
      setTimeout(initCodeCopyButtons, 0);
      return result;
    },
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => `
    <pre style="background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));</code></pre>
  `,
};

export const TypeScript: Story = {
  render: () => `
    <pre style="background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">
<code>interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30,
};</code></pre>
  `,
};
