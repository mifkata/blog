import type { Meta, StoryObj } from "@storybook/html";

interface HeaderLinkProps {
  href: string;
  number?: string;
  label: string;
  isActive?: boolean;
}

const createHeaderLink = (args: HeaderLinkProps): string => {
  const baseClasses =
    "inline-flex items-center gap-1 no-underline transition-colors";

  const numberHtml = args.number
    ? `<span style="font-size: 0.875rem; color: #6b7280;">${args.number}.</span>`
    : "";

  return `<a href="${args.href}" class="${baseClasses}" style="color: ${args.isActive ? "#f97316" : "#374151"}; font-weight: ${args.isActive ? "500" : "normal"};">
    ${numberHtml}
    ${args.label}
  </a>`;
};

const meta: Meta<HeaderLinkProps> = {
  title: "Components/HeaderLink",
  render: (args) => createHeaderLink(args),
  argTypes: {
    href: { control: "text" },
    number: { control: "text" },
    label: { control: "text" },
    isActive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<HeaderLinkProps>;

export const Default: Story = {
  args: {
    href: "/blog",
    label: "Blog",
    isActive: false,
  },
};

export const WithNumber: Story = {
  args: {
    href: "/blog",
    number: "01",
    label: "Blog",
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    href: "/blog",
    number: "01",
    label: "Blog",
    isActive: true,
  },
};

export const Navigation: Story = {
  render: () => `
    <div style="display: flex; gap: 24px; text-transform: uppercase;">
      ${createHeaderLink({ href: "/blog", number: "01", label: "Blog", isActive: true })}
      ${createHeaderLink({ href: "/about", number: "02", label: "About", isActive: false })}
      ${createHeaderLink({ href: "/services", number: "03", label: "Services", isActive: false })}
    </div>
  `,
};
