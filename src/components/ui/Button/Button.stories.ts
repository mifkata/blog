import type { Meta, StoryObj } from "@storybook/html";

interface ButtonProps {
  label: string;
  variant: "normal" | "inverse" | "ghost";
  href?: string;
}

const createButton = (args: ButtonProps): string => {
  const baseStyles =
    "inline-flex items-center gap-2 px-4 py-2 rounded no-underline transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md";
  const variantStyles = {
    normal:
      "bg-gradient-to-br from-[#f8f0e3] to-[#e8d4bc] text-[#8b5a2b] border border-[#8b5a2b] hover:from-[#f0e2cc] hover:to-[#dcc6a8]",
    inverse:
      "bg-gradient-to-br from-[#e8935f] to-[#b85a38] text-[#f8f0e3] hover:from-[#db8652] hover:to-[#a84f30]",
    ghost:
      "bg-transparent text-[#8b5a2b] border border-[#8b5a2b] hover:bg-[#f8f0e3]/50",
  };

  const classes = `${baseStyles} ${variantStyles[args.variant]}`;
  const tag = args.href ? "a" : "button";
  const hrefAttr = args.href ? `href="${args.href}"` : "";

  return `<${tag} ${hrefAttr} class="${classes}">${args.label}</${tag}>`;
};

const meta: Meta<ButtonProps> = {
  title: "Components/Button",
  render: (args) => createButton(args),
  argTypes: {
    variant: {
      control: "select",
      options: ["normal", "inverse", "ghost"],
    },
    href: {
      control: "text",
    },
    label: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Normal: Story = {
  args: {
    label: "Normal Button",
    variant: "normal",
  },
};

export const Inverse: Story = {
  args: {
    label: "Inverse Button",
    variant: "inverse",
  },
};

export const Ghost: Story = {
  args: {
    label: "Ghost Button",
    variant: "ghost",
  },
};

export const AsLink: Story = {
  args: {
    label: "Link Button",
    variant: "inverse",
    href: "/example",
  },
};

export const AllVariants: Story = {
  render: () => `
    <div style="display: flex; gap: 16px; align-items: center;">
      ${createButton({ label: "Normal", variant: "normal" })}
      ${createButton({ label: "Inverse", variant: "inverse" })}
      ${createButton({ label: "Ghost", variant: "ghost" })}
    </div>
  `,
};
