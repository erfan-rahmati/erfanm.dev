type SiteFooterIconProps = Readonly<{
  className?: string;
}>;

export function SiteFooterPhoneIcon({
  className,
}: SiteFooterIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.5 3.5 10 8l-2.2 1.6a14.2 14.2 0 0 0 6.6 6.6L16 14l4.5 2.5-.7 3.1a2 2 0 0 1-2 1.6C9.5 20.6 3.4 14.5 2.8 6.2a2 2 0 0 1 1.6-2l3.1-.7Z" />
    </svg>
  );
}

export function SiteFooterMessageIcon({
  className,
}: SiteFooterIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-11.8 6.1L4 19l1.4-4A7.5 7.5 0 1 1 20 11.5Z" />
      <path d="M8.5 11.5h.01" />
      <path d="M12 11.5h.01" />
      <path d="M15.5 11.5h.01" />
    </svg>
  );
}

export function SiteFooterTelegramIcon({
  className,
}: SiteFooterIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21 4-8.2 16-3.7-6.6L3 10.5 21 4Z" />
      <path d="m9.1 13.4 4.8-4.5" />
    </svg>
  );
}

export function SiteFooterArrowIcon({
  className,
}: SiteFooterIconProps) {
  return (
    <svg
      className={className}
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