import type { Meta, StoryObj } from "@/helpers/storybook";
import { groupByMonth } from "@/helpers/notes";
import NotesTimeline from "./NotesTimeline.astro";

const note = (id: string, title: string, date: string, text: string) => ({
  id,
  title,
  date: new Date(date),
  text,
});

const NOTES = [
  note(
    "2026-10-12-notes",
    "Notes section is taking shape",
    "2026-10-12",
    "Sketching a diary-style corner of the blog for updates that don't deserve a whole post.",
  ),
  note(
    "2026-10-09-small-tasks",
    "Agents need smaller tasks than I think",
    "2026-10-09",
    "Every time I split a ticket in half, the result gets better, not just faster.",
  ),
  note(
    "2026-10-04-devcontainer",
    "Devcontainer rebuild, again",
    "2026-10-04",
    "Moved the notifier into a script and it finally survives a restart.",
  ),
  note(
    "2026-09-28-skills",
    "Skills, one month in",
    "2026-09-28",
    "The review skill catches what I used to catch by hand.",
  ),
  note(
    "2026-09-19-cards",
    "Circuit board social cards",
    "2026-09-19",
    "Every page now gets a generated card. Shelf next.",
  ),
];

const meta: Meta<typeof NotesTimeline> = {
  title: "Pages/Notes/NotesTimeline",
  component: NotesTimeline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NotesTimeline>;

export const Default: Story = {
  args: { months: groupByMonth(NOTES), pageSize: 3 },
};

export const SinglePage: Story = {
  args: { months: groupByMonth(NOTES), pageSize: 20 },
};

export const BookReviews: Story = {
  args: {
    months: groupByMonth([
      {
        ...note(
          "2026-10-13-four-thousand-weeks",
          "Four Thousand Weeks",
          "2026-10-13",
          "A time-management book about accepting that you cannot fit everything into a Tuesday.",
        ),
        bookReview: true,
      },
      ...NOTES.slice(0, 2),
      {
        ...note(
          "2026-10-07-software-design",
          "A Philosophy of Software Design",
          "2026-10-07",
          "The chapter on deep modules made me reconsider several of my abstractions.",
        ),
        bookReview: true,
      },
      ...NOTES.slice(2),
    ]),
    pageSize: 3,
  },
};

export const Empty: Story = {
  args: { months: [] },
};

export const AcrossYears: Story = {
  args: {
    months: groupByMonth([
      ...NOTES.slice(0, 2),
      note(
        "2025-12-30-year-end",
        "Year-end tidy",
        "2025-12-30",
        "Closed out the year with a round of small fixes.",
      ),
    ]),
    pageSize: 20,
  },
};
