import type { Meta, StoryObj } from "@storybook/html";

interface FormattedDateProps {
  date: Date;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const createFormattedDate = (args: FormattedDateProps): string => {
  const formatted = formatDate(args.date);
  return `<time datetime="${args.date.toISOString()}">${formatted}</time>`;
};

const meta: Meta<FormattedDateProps> = {
  title: "Components/FormattedDate",
  render: (args) => createFormattedDate(args),
  argTypes: {
    date: { control: "date" },
  },
};

export default meta;
type Story = StoryObj<FormattedDateProps>;

export const Default: Story = {
  args: {
    date: new Date("2025-12-31"),
  },
};

export const Today: Story = {
  args: {
    date: new Date(),
  },
};

export const OldDate: Story = {
  args: {
    date: new Date("2020-01-15"),
  },
};

export const VariousDates: Story = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${createFormattedDate({ date: new Date("2025-01-01") })}
      ${createFormattedDate({ date: new Date("2025-06-15") })}
      ${createFormattedDate({ date: new Date("2025-12-31") })}
    </div>
  `,
};
