import "server-only";

import {
  collaborationDurationOptions,
  collaborationProjectTypeOptions,
} from "@/features/home/contact/contact.data";
import {
  formatBudgetInput,
} from "@/features/home/contact/contact.utils";

type CollaborationTelegramMessageInput =
  Readonly<{
    trackingCode: string;
    fullName: string;
    phone: string;
    projectTypes: readonly string[];
    proposedDuration: string;
    proposedBudgetToman: number | null;
    description: string | null;
    createdAt: Date;
  }>;

const projectTypeLabels = new Map(
  collaborationProjectTypeOptions.map(
    (option) => [
      option.id,
      option.label,
    ],
  ),
);

const durationLabels = new Map(
  collaborationDurationOptions.map(
    (option) => [
      option.id,
      option.label,
    ],
  ),
);

function escapeTelegramHtml(
  value: string,
) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatSubmittedAt(
  createdAt: Date,
) {
  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Tehran",
    },
  ).format(createdAt);
}

export function createCollaborationTelegramMessage(
  input: CollaborationTelegramMessageInput,
) {
  const projectTypes =
    input.projectTypes
      .map(
        (projectTypeId) =>
          projectTypeLabels.get(
            projectTypeId as never,
          ) ?? projectTypeId,
      )
      .map(
        (label) =>
          `• ${escapeTelegramHtml(label)}`,
      )
      .join("\n");

  const duration =
    durationLabels.get(
      input.proposedDuration as never,
    ) ?? input.proposedDuration;

  const budget =
    input.proposedBudgetToman === null
      ? "توافقی"
      : `${formatBudgetInput(
          String(
            input.proposedBudgetToman,
          ),
        )} تومان`;

  const description =
    input.description?.trim() ||
    "بدون توضیحات تکمیلی";

  return [
    "<b>📥 درخواست همکاری جدید</b>",
    "",
    "<b>🔖 کد پیگیری</b>",
    escapeTelegramHtml(
      input.trackingCode,
    ),
    "",
    "<b>👤 نام و نام خانوادگی</b>",
    escapeTelegramHtml(input.fullName),
    "",
    "<b>📞 شماره تماس</b>",
    escapeTelegramHtml(input.phone),
    "",
    "<b>🧩 نوع پروژه</b>",
    projectTypes,
    "",
    "<b>⏳ مدت‌زمان پیشنهادی</b>",
    escapeTelegramHtml(duration),
    "",
    "<b>💰 بودجه پیشنهادی</b>",
    escapeTelegramHtml(budget),
    "",
    "<b>📝 توضیحات پروژه</b>",
    escapeTelegramHtml(description),
    "",
    "<b>🕒 زمان ثبت</b>",
    escapeTelegramHtml(
      formatSubmittedAt(
        input.createdAt,
      ),
    ),
  ].join("\n");
}