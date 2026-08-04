import type {
  RecentArticleCoverId,
} from "./recent-articles.types";

type RecentArticleCoverArtworkProps = Readonly<{
  id: RecentArticleCoverId;
}>;

export function RecentArticleCoverArtwork({
  id,
}: RecentArticleCoverArtworkProps) {
  switch (id) {
    case "web-development-seo":
      return (
        <svg
          viewBox="0 0 320 180"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="45"
            y="35"
            width="174"
            height="108"
            rx="12"
            className="recent-articles__artwork-panel"
          />

          <path
            d="M45 58h174"
            className="recent-articles__artwork-line"
          />

          <circle
            cx="60"
            cy="47"
            r="3"
            className="recent-articles__artwork-dot"
          />

          <circle
            cx="70"
            cy="47"
            r="3"
            className="recent-articles__artwork-dot"
          />

          <circle
            cx="80"
            cy="47"
            r="3"
            className="recent-articles__artwork-dot"
          />

          <path
            d="m82 85-14 11 14 11"
            className="recent-articles__artwork-code"
          />

          <path
            d="m117 85 14 11-14 11"
            className="recent-articles__artwork-code"
          />

          <path
            d="m108 76-16 40"
            className="recent-articles__artwork-code"
          />

          <path
            d="M74 126h92"
            className="recent-articles__artwork-muted-line"
          />

          <circle
            cx="229"
            cy="111"
            r="39"
            className="recent-articles__artwork-accent-circle"
          />

          <circle
            cx="229"
            cy="111"
            r="18"
            className="recent-articles__artwork-search"
          />

          <path
            d="m242 124 15 15"
            className="recent-articles__artwork-search"
          />

          <path
            d="M250 74v-18"
            className="recent-articles__artwork-growth"
          />

          <path
            d="m241 65 9-9 9 9"
            className="recent-articles__artwork-growth"
          />
        </svg>
      );

    case "ecommerce-design":
      return (
        <svg
          viewBox="0 0 320 180"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="50"
            y="31"
            width="175"
            height="118"
            rx="13"
            className="recent-articles__artwork-panel"
          />

          <path
            d="M50 55h175"
            className="recent-articles__artwork-line"
          />

          <circle
            cx="65"
            cy="43"
            r="3"
            className="recent-articles__artwork-dot"
          />

          <circle
            cx="75"
            cy="43"
            r="3"
            className="recent-articles__artwork-dot"
          />

          <circle
            cx="85"
            cy="43"
            r="3"
            className="recent-articles__artwork-dot"
          />

          <rect
            x="68"
            y="73"
            width="59"
            height="50"
            rx="8"
            className="recent-articles__artwork-product"
          />

          <rect
            x="139"
            y="73"
            width="59"
            height="50"
            rx="8"
            className="recent-articles__artwork-product"
          />

          <path
            d="M76 132h42"
            className="recent-articles__artwork-muted-line"
          />

          <path
            d="M147 132h42"
            className="recent-articles__artwork-muted-line"
          />

          <path
            d="M239 78h12l8 43h-47l7-30h35"
            className="recent-articles__artwork-cart"
          />

          <circle
            cx="222"
            cy="132"
            r="5"
            className="recent-articles__artwork-cart"
          />

          <circle
            cx="251"
            cy="132"
            r="5"
            className="recent-articles__artwork-cart"
          />

          <path
            d="m231 96 7 7 13-16"
            className="recent-articles__artwork-growth"
          />
        </svg>
      );
  }
}

type RecentArticlesArrowIconProps = Readonly<{
  direction: "previous" | "next";
}>;

export function RecentArticlesArrowIcon({
  direction,
}: RecentArticlesArrowIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "previous" ? (
        <>
          <path d="m15 18 6-6-6-6" />
          <path d="M3 12h18" />
        </>
      ) : (
        <>
          <path d="m9 18-6-6 6-6" />
          <path d="M21 12H3" />
        </>
      )}
    </svg>
  );
}

export function RecentArticlesArticleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h9l4 4v14H6V3Z" />
      <path d="M14 3v5h5" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M9 8h1" />
    </svg>
  );
}

export function RecentArticlesExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}