import {
  siteContact,
  siteIdentity,
} from "@/config/site";

export const siteFooterContent = {
  brand: siteIdentity.brand,
  publicDomain: siteIdentity.publicDomain,
  ownerName: siteIdentity.ownerName,
  description: siteIdentity.footerDescription,
  navigationTitle: "دسترسی سریع",
  communicationTitle: "راه‌های ارتباطی",
  copyrightLabel: "تمام حقوق محفوظ است.",
  navigation: [
    {
      label: "خانه",
      href: "/",
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
      label: "مقالات اخیر",
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