const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const ENGLISH_DIGITS = "0123456789";

export function toEnglishDigits(value: string) {
  return Array.from(value)
    .map((character) => {
      const persianIndex =
        PERSIAN_DIGITS.indexOf(character);

      if (persianIndex >= 0) {
        return ENGLISH_DIGITS[persianIndex];
      }

      const arabicIndex =
        ARABIC_DIGITS.indexOf(character);

      if (arabicIndex >= 0) {
        return ENGLISH_DIGITS[arabicIndex];
      }

      return character;
    })
    .join("");
}

export function toPersianDigits(value: string) {
  return Array.from(value)
    .map((character) => {
      const englishIndex =
        ENGLISH_DIGITS.indexOf(character);

      return englishIndex >= 0
        ? PERSIAN_DIGITS[englishIndex]
        : character;
    })
    .join("");
}

export function sanitizePhoneInput(value: string) {
  const normalizedValue =
    toEnglishDigits(value).trim();

  const hasInternationalPrefix =
    normalizedValue.startsWith("+");

  const digitsOnly =
    normalizedValue.replace(/\D/g, "").slice(0, 14);

  return hasInternationalPrefix
    ? `+${digitsOnly}`
    : digitsOnly;
}

export function normalizeIranianMobile(
  value: string,
) {
  let normalizedValue =
    toEnglishDigits(value).replace(/\D/g, "");

  if (normalizedValue.startsWith("0098")) {
    normalizedValue =
      `0${normalizedValue.slice(4)}`;
  }
  else if (normalizedValue.startsWith("98")) {
    normalizedValue =
      `0${normalizedValue.slice(2)}`;
  }
  else if (
    normalizedValue.startsWith("9") &&
    normalizedValue.length === 10
  ) {
    normalizedValue = `0${normalizedValue}`;
  }

  return normalizedValue;
}

export function isValidIranianMobile(
  value: string,
) {
  return /^09\d{9}$/.test(
    normalizeIranianMobile(value),
  );
}

export function sanitizeBudgetInput(
  value: string,
) {
  const digitsOnly =
    toEnglishDigits(value).replace(/\D/g, "");

  return digitsOnly.replace(
    /^0+(?=\d)/,
    "",
  );
}

export function formatBudgetInput(
  value: string,
) {
  if (!value) {
    return "";
  }

  const groupedValue = value.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );

  return toPersianDigits(groupedValue);
}