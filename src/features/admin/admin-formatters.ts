const persianDateFormatter =
  new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const persianNumberFormatter =
  new Intl.NumberFormat("fa-IR");

export function formatAdminDate(
  value: Date | string | null,
) {
  if (!value) {
    return "—";
  }

  return persianDateFormatter.format(
    typeof value === "string"
      ? new Date(value)
      : value,
  );
}

export function formatAdminNumber(
  value: number,
) {
  return persianNumberFormatter.format(value);
}

export function formatToman(
  value: number | null,
) {
  if (value === null) {
    return "توافقی / نامشخص";
  }

  return `${persianNumberFormatter.format(value)} تومان`;
}
