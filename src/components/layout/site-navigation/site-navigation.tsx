"use client";

import type {
  CSSProperties,
  MouseEvent,
} from "react";

import {
  bottomNavigationItems,
  navigationContent,
  navigationSectionIds,
  navigationSocialLinks,
  siteNavigationItems,
} from "./site-navigation.data";
import {
  BottomNavigationIcon,
  NavigationArrowIcon,
  NavigationCloseIcon,
  NavigationDownloadIcon,
  NavigationSocialIcon,
} from "./site-navigation.icons";
import type {
  SiteNavigationItem,
  SiteSectionHref,
} from "./site-navigation.types";
import { useSiteNavigation } from "./use-site-navigation";

type NavigationStaggerStyle =
  CSSProperties & {
    "--stagger": number;
  };

function createStaggerStyle(
  stagger: number,
): NavigationStaggerStyle {
  return {
    "--stagger": stagger,
  };
}

function createClassName(
  baseClassName: string,
  activeClassName: string,
  isActive: boolean,
): string {
  return [
    baseClassName,
    isActive ? activeClassName : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function SiteNavigation() {
  const {
    activeSectionId,
    closeButtonRef,
    closeMobileMenu,
    handleResumeDownload,
    handleSectionLinkClick,
    isHeaderScrolled,
    isMobileMenuOpen,
    toggleButtonRef,
    toggleMobileMenu,
  } = useSiteNavigation(
    navigationSectionIds,
  );

  const headerClassName = createClassName(
    "header",
    "header--scrolled",
    isHeaderScrolled,
  );

  const menuToggleClassName =
    createClassName(
      "header__menu-toggle",
      "header__menu-toggle--active",
      isMobileMenuOpen,
    );

  const overlayClassName =
    createClassName(
      "mobile-overlay",
      "mobile-overlay--active",
      isMobileMenuOpen,
    );

  const mobileNavigationClassName =
    createClassName(
      "mobile-nav",
      "mobile-nav--open",
      isMobileMenuOpen,
    );

  function renderDesktopNavigationItem(
    navigationItem: SiteNavigationItem,
  ) {
    const isActive =
      navigationItem.id === activeSectionId;

    const linkClassName = createClassName(
      "header__nav-link",
      "header__nav-link--active",
      isActive,
    );

    return (
      <li
        key={navigationItem.id}
        className="header__nav-item"
      >
        <a
          href={navigationItem.href}
          className={linkClassName}
          aria-current={
            isActive ? "location" : undefined
          }
          data-nav-link
          onClick={(event) => {
            handleSectionLinkClick(
              event,
              navigationItem.href,
            );
          }}
        >
          {navigationItem.label}
        </a>
      </li>
    );
  }

  function handleCollaborationClick(
    event: MouseEvent<HTMLAnchorElement>,
    closeAfterNavigation = false,
  ) {
    handleSectionLinkClick(
      event,
      "#contact",
      closeAfterNavigation,
    );
  }

  function handleLogoClick(
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    handleSectionLinkClick(
      event,
      "#home",
    );
  }

  function handleMobileNavigationClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: SiteSectionHref,
  ) {
    handleSectionLinkClick(
      event,
      href,
      true,
    );
  }

  return (
    <>
      <header
        className={headerClassName}
        id="siteHeader"
      >
        <div className="header__container">
          <a
            href="#contact"
            className="header-btn"
            onClick={(event) => {
              handleCollaborationClick(event);
            }}
          >
            <NavigationArrowIcon />

            <span>
              {
                navigationContent
                  .collaborationLabel
              }
            </span>
          </a>

          <nav
            className="header__nav"
            aria-label="ناوبری اصلی"
          >
            <ul className="header__nav-list">
              {siteNavigationItems.map(
                renderDesktopNavigationItem,
              )}
            </ul>
          </nav>

          <a
            href="#home"
            className="header__logo"
            aria-label={
              navigationContent.logoLabel
            }
            onClick={handleLogoClick}
          >
            erfanm
            <span className="header__logo-accent">
              .dev
            </span>
          </a>

          <button
            ref={toggleButtonRef}
            type="button"
            className={
              menuToggleClassName
            }
            aria-expanded={
              isMobileMenuOpen
            }
            aria-controls="mobileNav"
            aria-label={
              isMobileMenuOpen
                ? "بستن منو"
                : "باز کردن منو"
            }
            onClick={toggleMobileMenu}
          >
            <span className="header__menu-toggle-line" />
            <span className="header__menu-toggle-line" />
            <span className="header__menu-toggle-line" />
          </button>
        </div>
      </header>

      <div
        className={overlayClassName}
        aria-hidden="true"
        onClick={closeMobileMenu}
      />

      <nav
        className={
          mobileNavigationClassName
        }
        id="mobileNav"
        aria-label="ناوبری موبایل"
        aria-hidden={
          !isMobileMenuOpen
        }
      >
        <div className="mobile-nav__header">
          <button
            ref={closeButtonRef}
            type="button"
            className="mobile-nav__close"
            aria-label="بستن منو"
            tabIndex={
              isMobileMenuOpen ? 0 : -1
            }
            onClick={closeMobileMenu}
          >
            <NavigationCloseIcon />
          </button>
        </div>

        <ul className="mobile-nav__list">
          {siteNavigationItems.map(
            (navigationItem) => {
              const isActive =
                navigationItem.id ===
                activeSectionId;

              const linkClassName =
                createClassName(
                  "mobile-nav__link",
                  "mobile-nav__link--active",
                  isActive,
                );

              return (
                <li
                  key={navigationItem.id}
                  className="mobile-nav__item"
                  style={createStaggerStyle(
                    navigationItem.mobileStagger,
                  )}
                >
                  <a
                    href={
                      navigationItem.href
                    }
                    className={
                      linkClassName
                    }
                    aria-current={
                      isActive
                        ? "location"
                        : undefined
                    }
                    tabIndex={
                      isMobileMenuOpen
                        ? 0
                        : -1
                    }
                    onClick={(event) => {
                      handleMobileNavigationClick(
                        event,
                        navigationItem.href,
                      );
                    }}
                  >
                    <span className="mobile-nav__link-text">
                      {
                        navigationItem.label
                      }
                    </span>
                  </a>
                </li>
              );
            },
          )}
        </ul>

        <div className="mobile-nav__actions">
          <a
            href="#contact"
            className="mobile-nav__btn mobile-nav__btn--primary"
            tabIndex={
              isMobileMenuOpen ? 0 : -1
            }
            onClick={(event) => {
              handleCollaborationClick(
                event,
                true,
              );
            }}
          >
            <span>
              {
                navigationContent
                  .collaborationLabel
              }
            </span>

            <span
              style={{
                rotate: "180deg",
              }}
            >
              <NavigationArrowIcon />
            </span>
          </a>

          <a
            href={
              navigationContent.resumeHref
            }
            download="Erfan-Resume.pdf"
            className="mobile-nav__btn mobile-nav__btn--secondary"
            tabIndex={
              isMobileMenuOpen ? 0 : -1
            }
            onClick={
              handleResumeDownload
            }
          >
            <span>
              {
                navigationContent
                  .resumeLabel
              }
            </span>

            <NavigationDownloadIcon />
          </a>
        </div>

        <div className="mobile-nav__footer">
          <span className="mobile-nav__footer-label">
            ارتباط با من
          </span>

          <div className="mobile-nav__social">
            {navigationSocialLinks.map(
              (socialLink) => (
                <a
                  key={socialLink.id}
                  href={socialLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    socialLink.label
                  }
                  tabIndex={
                    isMobileMenuOpen
                      ? 0
                      : -1
                  }
                  onClick={
                    closeMobileMenu
                  }
                >
                  <NavigationSocialIcon
                    id={socialLink.id}
                  />
                </a>
              ),
            )}
          </div>
        </div>
      </nav>

      <nav
        className="bottom-nav"
        aria-label="ناوبری پایین"
      >
        <ul className="bottom-nav__list">
          {bottomNavigationItems.map(
            (navigationItem) => {
              const isActive =
                navigationItem.id ===
                activeSectionId;

              const linkClassName =
                createClassName(
                  "bottom-nav__link",
                  "bottom-nav__link--active",
                  isActive,
                );

              return (
                <li
                  key={navigationItem.id}
                  className="bottom-nav__item"
                >
                  <a
                    href={
                      navigationItem.href
                    }
                    className={
                      linkClassName
                    }
                    aria-current={
                      isActive
                        ? "location"
                        : undefined
                    }
                    onClick={(event) => {
                      handleSectionLinkClick(
                        event,
                        navigationItem.href,
                      );
                    }}
                  >
                    <BottomNavigationIcon
                      id={
                        navigationItem.icon
                      }
                    />

                    <span>
                      {
                        navigationItem.label
                      }
                    </span>
                  </a>
                </li>
              );
            },
          )}
        </ul>
      </nav>
    </>
  );
}