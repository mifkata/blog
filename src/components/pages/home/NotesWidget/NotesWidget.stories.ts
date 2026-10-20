import type { Meta, StoryObj } from "@storybook-astro/framework";
import NotesWidget from "./NotesWidget.astro";

const NOTES = [
  {
    id: "2026-10-08-shelf-details",
    title: "Shelf books show details",
    date: new Date("2026-10-08"),
    text: "Books on the shelf now open a details panel instead of sending you off to Goodreads.",
  },
  {
    id: "2026-10-07-accessibility-pass",
    title: "Accessibility pass and lighter images",
    date: new Date("2026-10-07"),
    text: "Fixed a round of contrast and focus issues, and switched images to AVIF with a WebP fallback. The pages got lighter and easier to read, and the next pass goes to the code blocks and the keyboard order on the home page.",
  },
  {
    id: "2026-10-07-social-cards",
    title: "Circuit board social cards",
    date: new Date("2026-10-07"),
    text: "Every page now gets a generated social card in the circuit board palette.",
  },
  {
    id: "2026-10-06-surge-buttons",
    title: "Buttons that light up",
    date: new Date("2026-10-06"),
    text: "Buttons now send a band of current across them on hover.",
  },
];

const meta: Meta<typeof NotesWidget> = {
  title: "Pages/Home/NotesWidget",
  component: NotesWidget,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NotesWidget>;

export const Default: Story = {
  args: { notes: NOTES },
};

export const TwoNotes: Story = {
  args: { notes: NOTES.slice(0, 2) },
};

export const BookReviews: Story = {
  args: {
    notes: [
      NOTES[0],
      {
        id: "2026-10-07-four-thousand-weeks",
        title: "Four Thousand Weeks",
        date: new Date("2026-10-07"),
        text: "A time-management book about accepting that you cannot fit everything into a Tuesday.",
        bookReview: true,
      },
      NOTES[2],
      {
        id: "2026-10-06-software-design",
        title: "A Philosophy of Software Design",
        date: new Date("2026-10-06"),
        text: "The chapter on deep modules made me reconsider several of my abstractions.",
        bookReview: true,
      },
    ],
  },
};

export const Empty: Story = {
  args: { notes: [] },
};
