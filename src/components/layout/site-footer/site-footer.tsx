import Link from "next/link";

import { siteFooterContent } from "./site-footer.data";
import {
  SiteFooterArrowIcon,
  SiteFooterMessageIcon,
  SiteFooterPhoneIcon,
  SiteFooterTelegramIcon,
} from "./site-footer.icons";

function getCommunicationIcon(communicationId: string) {
  switch (communicationId) {
    case "phone":
      return <SiteFooterPhoneIcon />;

    case "whatsapp":
      return <SiteFooterMessageIcon />;

    case "telegram":
      return <SiteFooterTelegramIcon />;

    default:
      return null;
  }
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__background" aria-hidden="true">
        <span className="site-footer__glow" />
        <span className="site-footer__grid" />
      </div>

      <div className="site-footer__container">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Link
              href="/"
              className="site-footer__logo"
              aria-label={`${siteFooterContent.brand} — صفحه اصلی`}
            >
              <span className="site-footer__logo-mark">E</span>

              <span className="site-footer__logo-text">
                {siteFooterContent.brand}
              </span>
            </Link>

            <p className="site-footer__description">
              {siteFooterContent.description}
            </p>

            <div className="site-footer__domain">
              <span aria-hidden="true" />

              <a
                href={`https://${siteFooterContent.publicDomain}`}
                target="_blank"
                rel="noreferrer"
                dir="ltr"
              >
                {siteFooterContent.publicDomain}
              </a>
              <div className="footer-divider"></div>
            </div>
            <p className="site-footer__text">
              {siteFooterContent.text}
            </p>
          </div>

          <nav
            className="site-footer__navigation"
            aria-label="دسترسی سریع پایین صفحه"
          >
            <h2>{siteFooterContent.navigationTitle}</h2>

            <ul>
              {siteFooterContent.navigation.map((navigationItem) => (
                <li key={navigationItem.href}>
                  <Link href={navigationItem.href}>
                    <span aria-hidden="true" />
                    {navigationItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__communication">
            <h2>{siteFooterContent.communicationTitle}</h2>
            <span className="site-footer__communicationdescription"> {siteFooterContent.communicationdescription}</span>

            <div className="site-footer__communication-list">
              {siteFooterContent.communication.map((communicationItem) => {
                const isExternal =
                  communicationItem.href.startsWith("https://");

                return (
                  <a
                    key={communicationItem.id}
                    href={communicationItem.href}
                    className="site-footer__communication-link"
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                  >
                    <span className="site-footer__communication-icon">
                      {getCommunicationIcon(communicationItem.id)}
                    </span>

                    <span className="site-footer__communication-content">
                      <small>{communicationItem.label}</small>

                      <strong dir="ltr">{communicationItem.value}</strong>
                    </span>

                    <SiteFooterArrowIcon className="site-footer__communication-arrow" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            © <bdi>{currentYear}</bdi> {siteFooterContent.copyrightLabel}
            {siteFooterContent.brand}{" "}
          </p>

          <p>
            طراحی، توسعه و نگهداری توسط <strong>{siteFooterContent.ownerName}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
