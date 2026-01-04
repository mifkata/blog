import React, { useState, useEffect, useRef } from "react";
import { tv } from "tailwind-variants";
import { Markdown } from "@/components/post/Markdown/Markdown";

const ROTATE_INTERVAL = 3000;

export interface SeriesItem {
  url: string;
  title: string;
  synopsis?: string;
  heroImage?: string;
  updatedDate?: string;
}

interface Props {
  title: string;
  items: SeriesItem[];
}

const styles = tv({
  slots: {
    section: "max-w-[960px] mx-auto pb-12",
    header: "flex flex-col mb-4",
    headerLabel: "text-lg text-gray tracking-wider uppercase text-nowrap",
    headerTitle: "text-lg m-0 text-gray tracking-wider",
    divider: "flex-1 h-px bg-gray-light",
    grid: "flex flex-col md:grid gap-4 overflow-visible h-auto relative md:-mb-24",
    card: [
      "group w-full h-auto md:h-40 p-0 md:my-16",
      "bg-white border border-gray-light rounded-lg",
      "hover:border-accent hover:shadow-lg",
      "transition-all duration-300 ease-out text-left cursor-pointer overflow-hidden",
      "origin-top cursor-pointer",
    ],
    image: [
      "hidden md:block w-full min-h-32 rounded-t-lg",
      "object-cover transition-transform ease-out duration-300",
    ],
    desktopTitle: "rounded-b-lg w-full p-4 pb-2 hover:underline hidden",
    titleText: "m-0 z-10 line-clamp-2",
    mobileTitle: "relative p-4 rounded-b-lg w-full block md:hidden",
    mobileHighlight: [
      "absolute top-0 bottom-0 left-0 right-0",
      "w-0 transition-all duration-200 ease-out",
      "mix-blend-exclusion bg-teal-500/30 z-[5]",
    ],
    details: "mt-6 p-6 bg-white border border-gray-light rounded-lg",
    detailsImage: "block md:hidden w-full rounded-t-lg mb-4",
    synopsis: "mb-3 leading-relaxed md:columns-2 gap-6",
    footer: "md:flex items-center justify-between",
    date: "text-gray m-0 text-sm",
    readMore:
      "text-accent hover:text-accent-dark font-medium no-underline text-nowrap",
  },
  variants: {
    active: {
      true: {
        card: "border-accent shadow-lg md:h-auto scale-115 z-10 relative md:mt-0 md:mb-32",
        image: "scale-100",
        desktopTitle: "hidden md:block",
        mobileHighlight: "w-full",
      },
      false: {
        image: "scale-[3]",
      },
    },
    position: {
      first: {},
      last: {},
      middle: {},
    },
    columns: {
      1: { grid: "md:grid-cols-1 min-h-128" },
      2: { grid: "md:grid-cols-2" },
      3: { grid: "md:grid-cols-3" },
      4: { grid: "md:grid-cols-4" },
    },
  },
  compoundVariants: [
    { active: true, position: "first", class: { card: "md:ml-3" } },
    { active: true, position: "last", class: { card: "md:-ml-3" } },
  ],
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `Last updated: ${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
}

export function FeaturedSeries({ title, items }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const columns = Math.min(items.length, 4) as 1 | 2 | 3 | 4;
  const s = styles({ columns });

  const stopRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const selectItem = (index: number) => {
    stopRotation();
    setCurrentIndex(index);
  };

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, ROTATE_INTERVAL);

    return () => stopRotation();
  }, [items.length]);

  const activeItem = items[currentIndex];

  return (
    <section className={s.section()}>
      {/* Header */}
      <div className={s.header()}>
        <h3 className={s.headerLabel()}>Featured Series:</h3>
        <h4 className={s.headerTitle()}>{title}</h4>
        <div className={s.divider()} />
      </div>

      {/* Grid */}
      <div className={s.grid()}>
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          const position =
            index === 0
              ? "first"
              : index === items.length - 1
                ? "last"
                : "middle";
          const itemStyles = styles({ active: isActive, position });

          return (
            <button
              key={item.url}
              type="button"
              onClick={() => selectItem(index)}
              className={itemStyles.card()}
            >
              {item.heroImage && (
                <img
                  src={item.heroImage}
                  alt={item.title}
                  className={itemStyles.image()}
                />
              )}

              {/* Desktop title - only show when active */}
              <a
                href={item.url}
                className={itemStyles.desktopTitle()}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className={s.titleText()}>{item.title}</h4>
              </a>

              {/* Mobile title with highlight */}
              <div className={s.mobileTitle()}>
                <div className={itemStyles.mobileHighlight()} />
                <h4 className={s.titleText()}>{item.title}</h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Details */}
      <div className={s.details()}>
        {activeItem?.heroImage && (
          <img
            src={activeItem.heroImage}
            alt={activeItem.title}
            className={s.detailsImage()}
          />
        )}

        {activeItem?.synopsis && (
          <div className={s.synopsis()}>
            <Markdown text={activeItem.synopsis} />
          </div>
        )}

        <div className={s.footer()}>
          <p className={s.date()}>
            {activeItem?.updatedDate && formatDate(activeItem.updatedDate)}
          </p>
          <a href={activeItem?.url || "#"} className={s.readMore()}>
            Read more →
          </a>
        </div>
      </div>
    </section>
  );
}
