import type {
  BottomNavigationItem,
  NavigationContent,
  NavigationSocialLink,
  SiteNavigationItem,
  SiteSectionId,
} from "./site-navigation.types";

export const navigationContent = {
  logoLabel: "erfanm.dev — بازگشت به صفحه اصلی",
  collaborationLabel: "درخواست مشاوره",
  resumeLabel: "دریافت رزومه",
  resumeHref: "/files/resume.pdf",
} as const satisfies NavigationContent;

export const siteNavigationItems = [
  {
    id: "home",
    label: "خانه",
    href: "#home",
    mobileStagger: 1,
  },
  {
    id: "projects",
    label: "پروژه‌ها",
    href: "#projects",
    mobileStagger: 2,
  },
  {
    id: "about",
    label: "درباره من",
    href: "#about",
    mobileStagger: 3,
  },
  {
    id: "skills",
    label: "مهارت‌ها",
    href: "#skills",
    mobileStagger: 2,
  },
  {
    id: "blog",
    label: "وبلاگ",
    href: "#blog",
    mobileStagger: 2,
  },
  {
    id: "contact",
    label: "تماس",
    href: "#contact",
    mobileStagger: 4,
  },
] as const satisfies readonly SiteNavigationItem[];

export const navigationSectionIds =
  siteNavigationItems.map(
    (navigationItem) => navigationItem.id,
  ) satisfies readonly SiteSectionId[];

export const bottomNavigationItems = [
  {
    id: "home",
    label: "خانه",
    href: "#home",
    icon: "home",
  },
  {
    id: "projects",
    label: "پروژه‌ها",
    href: "#projects",
    icon: "projects",
  },
  {
    id: "about",
    label: "درباره",
    href: "#about",
    icon: "about",
  },
  {
    id: "blog",
    label: "بلاگ",
    href: "#blog",
    icon: "blog",
  },
  {
    id: "contact",
    label: "تماس",
    href: "#contact",
    icon: "contact",
  },
] as const satisfies readonly BottomNavigationItem[];

export const navigationSocialLinks = [
  {
    id: "github",
    label: "گیت‌هاب عرفان رحمتی",
    href: "https://github.com/erfanm-dev",
  },
  {
    id: "instagram",
    label: "اینستاگرام عرفان رحمتی",
    href: "https://instagram.com/erfanm.dev",
  },
  {
    id: "telegram",
    label: "تلگرام عرفان رحمتی",
    href: "https://t.me/erfanmdev",
  },
  {
    id: "linkedin",
    label: "لینکدین عرفان رحمتی",
    href: "https://linkedin.com/in/erfanm-dev",
  },
] as const satisfies readonly NavigationSocialLink[];