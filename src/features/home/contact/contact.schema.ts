import { z } from "zod";

import {
  COLLABORATION_DURATION_IDS,
  COLLABORATION_PROJECT_TYPE_IDS,
} from "./contact.types";
import {
  normalizeIranianMobile,
  sanitizeBudgetInput,
} from "./contact.utils";

const proposedBudgetTomanSchema = z.preprocess(
  (value) => {
    const normalizedValue = sanitizeBudgetInput(
      String(value ?? ""),
    );

    return normalizedValue
      ? Number(normalizedValue)
      : null;
  },
  z
    .number()
    .int("بودجه باید یک عدد صحیح باشد.")
    .positive("بودجه باید بیشتر از صفر باشد.")
    .max(
      Number.MAX_SAFE_INTEGER,
      "مقدار بودجه بیش از حد مجاز است.",
    )
    .nullable(),
);

const descriptionSchema = z.preprocess(
  (value) => {
    const normalizedValue = String(
      value ?? "",
    ).trim();

    return normalizedValue || null;
  },
  z
    .string()
    .max(
      4000,
      "توضیحات پروژه نمی‌تواند بیشتر از ۴۰۰۰ کاراکتر باشد.",
    )
    .nullable(),
);

export const collaborationRequestSubmissionSchema =
  z
    .object({
      fullName: z
        .string()
        .trim()
        .min(
          3,
          "نام و نام خانوادگی را وارد کن.",
        )
        .max(
          120,
          "نام و نام خانوادگی بیش از حد طولانی است.",
        )
        .refine(
          (value) =>
            value
              .split(/\s+/u)
              .filter(Boolean).length >= 2,
          {
            message:
              "نام و نام خانوادگی را کامل وارد کن.",
          },
        ),

      phone: z
        .string()
        .trim()
        .min(
          1,
          "شماره تماس را وارد کن.",
        )
        .transform(normalizeIranianMobile)
        .pipe(
          z.string().regex(
            /^09\d{9}$/,
            "شماره موبایل معتبر وارد کن.",
          ),
        ),

      projectTypes: z
        .array(
          z.enum(
            COLLABORATION_PROJECT_TYPE_IDS,
          ),
        )
        .min(
          1,
          "حداقل یک نوع پروژه را انتخاب کن.",
        )
        .max(
          COLLABORATION_PROJECT_TYPE_IDS.length,
          "تعداد گزینه‌های انتخاب‌شده معتبر نیست.",
        )
        .transform(
          (projectTypes) =>
            Array.from(new Set(projectTypes)),
        ),

      proposedDuration: z.enum(
        COLLABORATION_DURATION_IDS,
        {
          error:
            "مدت‌زمان پیشنهادی را انتخاب کن.",
        },
      ),

      proposedBudgetToman:
        proposedBudgetTomanSchema,

      description: descriptionSchema,

      website: z
        .string()
        .max(
          0,
          "درخواست نامعتبر است.",
        )
        .optional()
        .default(""),
    })
    .strict();

export type CollaborationRequestSubmission =
  z.infer<
    typeof collaborationRequestSubmissionSchema
  >;