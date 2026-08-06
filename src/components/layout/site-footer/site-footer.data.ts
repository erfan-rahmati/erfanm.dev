import {
  siteContact,
  siteIdentity,
} from "@/config/site";

export const siteFooterContent = {
  brand: siteIdentity.brand,
  publicDomain: siteIdentity.publicDomain,
  ownerName: siteIdentity.ownerName,
  description: siteIdentity.footerDescription,
  text: siteIdentity.footertext,
  navigationTitle: "دسترسی سریع",
  communicationTitle: "راه‌های ارتباطی",
  communicationdescription: "برای دریافت مشاوره، بررسی پروژه یا شروع همکاری، از یکی از راه‌های ارتباطی زیر با من در تماس باشید",
  copyrightLabel: "تمامی حقوق این وب‌سایت محفوظ است - ",
  navigation: [
    {
      label: "خانه",
      href: "/",
    },
    {
      label: "پروژه‌ها",
      href: "#projects",
    },
    {
      label: "درباره من",
      href: "/#about",
    },
    {
      label: "مهارت‌ها",
      href: "/#skills",
    },
    {
      label: "وبلاگ",
      href: "/#blog",
    },
    {
      label: "تماس و همکاری",
      href: "/#contact",
    },
  ],
  communication: [
    {
      id: "phone",
      label: siteContact.phone.label,
      value: siteContact.phone.displayValue,
      href: siteContact.phone.href,
    },
    {
      id: "whatsapp",
      label: siteContact.whatsapp.label,
      value: siteContact.whatsapp.displayValue,
      href: siteContact.whatsapp.href,
    },
    {
      id: "telegram",
      label: siteContact.telegram.label,
      value: siteContact.telegram.displayValue,
      href: siteContact.telegram.href,
    },
  ],
} as const;