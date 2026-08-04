import type {
  CollaborationDurationOption,
  CollaborationProjectTypeOption,
  ContactSectionContent,
} from "./contact.types";

export const contactSectionContent = {
  eyebrow: "شروع یک همکاری",
  title: "درباره پروژه‌ات با من صحبت کن",
  description:
    "برای بررسی پروژه، اطلاعات اولیه را ثبت کن. پس از بررسی جزئیات، برای ادامه گفتگو و مشخص‌کردن مسیر همکاری با تو تماس می‌گیرم.",
  formTitle: "درخواست همکاری",
  formDescription:
    "فیلدهای ضروری را تکمیل کن تا بتوانم دید اولیه مناسبی از پروژه داشته باشم.",
  communicationTitle: "ارتباط مستقیم",
  communicationDescription:
    "برای پرسش‌های کوتاه‌تر می‌توانی از طریق WhatsApp، Telegram یا تماس مستقیم با من در ارتباط باشی.",
  submitLabel: "ارسال درخواست همکاری",
  submittingLabel: "در حال ارسال درخواست",
} as const satisfies ContactSectionContent;

export const collaborationProjectTypeOptions = [
  {
    id: "custom-website",
    label: "طراحی سایت اختصاصی",
  },
  {
    id: "custom-web-application",
    label: "توسعه وب‌اپلیکیشن اختصاصی",
  },
  {
    id: "wordpress-website",
    label: "طراحی سایت با WordPress",
  },
  {
    id: "website-administration-support",
    label: "ادمین سایت و پشتیبانی",
  },
  {
    id: "seo-optimization",
    label: "بهینه‌سازی و سئو",
  },
  {
    id: "website-redesign-development",
    label: "بازطراحی یا توسعه سایت موجود",
  },
  {
    id: "other",
    label: "سایر",
  },
] as const satisfies readonly CollaborationProjectTypeOption[];

export const collaborationDurationOptions = [
  {
    id: "less-than-one-month",
    label: "کمتر از ۱ ماه",
  },
  {
    id: "one-to-three-months",
    label: "۱ تا ۳ ماه",
  },
  {
    id: "three-to-six-months",
    label: "۳ تا ۶ ماه",
  },
  {
    id: "more-than-six-months",
    label: "بیش از ۶ ماه",
  },
] as const satisfies readonly CollaborationDurationOption[];