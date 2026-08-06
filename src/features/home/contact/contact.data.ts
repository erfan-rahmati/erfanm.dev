import type {
  CollaborationDurationOption,
  CollaborationProjectTypeOption,
  ContactSectionContent,
} from "./contact.types";

export const contactSectionContent = {
  eyebrow: "درخواست مشاوره رایگان",
  title: " پروژه‌ای در ذهن داری؟ از همین‌جا شروع کنیم ",
  description:
    " اگر برای طراحی سایت، توسعه وب‌اپلیکیشن، فروشگاه اینترنتی، پنل مدیریت یا ارتقای یک سامانه موجود به دنبال همکاری هستید، کافی است اطلاعات اولیه پروژه را ثبت کنید. پس از بررسی، در کوتاه‌ترین زمان برای هماهنگی و ادامه مسیر با شما تماس می‌گیرم ",
  formTitle: "اطلاعات اولیه پروژه",
  formDescription:
    " هرچقدر اطلاعات دقیق‌تر باشد، پیشنهاد و برآورد مناسب‌تری برای پروژه شما ارائه خواهد شد ",
  communicationTitle: "راه‌های ارتباط مستقیم",
  communicationDescription:
    " اگر ترجیح می‌دهید پیش از ارسال فرم درباره پروژه صحبت کنیم، از طریق واتساپ، تلگرام یا تماس تلفنی در دسترس هستم ",
  submitLabel: "ثبت درخواست مشاوره",
  submittingLabel: "در حال ثبت درخواست",
  trustItems: [
  "پاسخ اولیه معمولاً کمتر از ۲۴ ساعت",
  "بررسی اولیه و مشاوره کاملا رایگان",
  "امکان همکاری با کسب‌وکارهای سراسر ایران",
] as const,
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