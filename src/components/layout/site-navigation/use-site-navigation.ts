"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { usePathname } from "next/navigation";

import type {
  SiteSectionHref,
  SiteSectionId,
} from "./site-navigation.types";

const HEADER_SCROLL_THRESHOLD = 20;
const SECTION_HIGHLIGHT_OFFSET = 120;
const SMOOTH_SCROLL_OFFSET = 70;
const DOWNLOAD_CLOSE_DELAY = 300;

export function useSiteNavigation(
  sectionIds: readonly SiteSectionId[],
) {
  const pathname = usePathname();
  const [isHeaderScrolled, setIsHeaderScrolled] =
    useState(false);

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  const [
    activeSectionId,
    setActiveSectionId,
  ] = useState<SiteSectionId>("home");

  const toggleButtonRef =
    useRef<HTMLButtonElement>(null);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  const downloadCloseTimerRef =
    useRef<number | null>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(
      (currentState) => !currentState,
    );
  }, []);

  useEffect(() => {
    let animationFrameId = 0;

    function updateScrollState() {
      const scrollPosition = window.scrollY;

      setIsHeaderScrolled(
        scrollPosition >
          HEADER_SCROLL_THRESHOLD,
      );

      if (pathname !== "/") {
        setActiveSectionId(
          pathname.startsWith("/blog")
            ? "blog"
            : pathname.startsWith("/projects")
              ? "projects"
              : "home",
        );
        return;
      }

      const highlightedPosition =
        scrollPosition +
        SECTION_HIGHLIGHT_OFFSET;

      let nextActiveSection: SiteSectionId =
        "home";

      let closestSectionTop =
        Number.NEGATIVE_INFINITY;

      sectionIds.forEach((sectionId) => {
        const sectionElement =
          document.getElementById(sectionId);

        if (!sectionElement) {
          return;
        }

        const sectionTop =
          sectionElement.getBoundingClientRect()
            .top + window.scrollY;

        if (
          sectionTop <= highlightedPosition &&
          sectionTop > closestSectionTop
        ) {
          nextActiveSection = sectionId;
          closestSectionTop = sectionTop;
        }
      });

      setActiveSectionId((currentSection) =>
        currentSection === nextActiveSection
          ? currentSection
          : nextActiveSection,
      );
    }

    function scheduleScrollUpdate() {
      window.cancelAnimationFrame(
        animationFrameId,
      );

      animationFrameId =
        window.requestAnimationFrame(
          updateScrollState,
        );
    }

    window.addEventListener(
      "scroll",
      scheduleScrollUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      scheduleScrollUpdate,
    );

    scheduleScrollUpdate();

    return () => {
      window.cancelAnimationFrame(
        animationFrameId,
      );

      window.removeEventListener(
        "scroll",
        scheduleScrollUpdate,
      );

      window.removeEventListener(
        "resize",
        scheduleScrollUpdate,
      );
    };
  }, [pathname, sectionIds]);

  useEffect(() => {
    document.body.classList.toggle(
      "no-scroll",
      isMobileMenuOpen,
    );

    let focusFrameId = 0;

    if (isMobileMenuOpen) {
      focusFrameId =
        window.requestAnimationFrame(() => {
          closeButtonRef.current?.focus();
        });
    }

    return () => {
      window.cancelAnimationFrame(
        focusFrameId,
      );

      document.body.classList.remove(
        "no-scroll",
      );
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    function handleEscapeKey(
      event: KeyboardEvent,
    ) {
      if (event.key !== "Escape") {
        return;
      }

      closeMobileMenu();

      window.requestAnimationFrame(() => {
        toggleButtonRef.current?.focus();
      });
    }

    document.addEventListener(
      "keydown",
      handleEscapeKey,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscapeKey,
      );
    };
  }, [
    closeMobileMenu,
    isMobileMenuOpen,
  ]);

  useEffect(() => {
    return () => {
      if (
        downloadCloseTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          downloadCloseTimerRef.current,
        );
      }
    };
  }, []);

  const handleSectionLinkClick = useCallback(
    (
      event: MouseEvent<HTMLAnchorElement>,
      href: SiteSectionHref,
      closeAfterNavigation = false,
    ) => {
      const hashIndex = href.indexOf("#");
      const hash =
        hashIndex >= 0
          ? href.slice(hashIndex)
          : "";
      const canScrollOnCurrentPage =
        pathname === "/";
      const targetElement =
        canScrollOnCurrentPage && hash
          ? document.querySelector<HTMLElement>(
              hash,
            )
          : null;

      if (targetElement) {
        event.preventDefault();

        const targetTop =
          targetElement.getBoundingClientRect()
            .top +
          window.scrollY -
          SMOOTH_SCROLL_OFFSET;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });
      }

      if (
        canScrollOnCurrentPage &&
        href === "/"
      ) {
        event.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      if (closeAfterNavigation) {
        closeMobileMenu();
      }
    },
    [closeMobileMenu, pathname],
  );

  const handleResumeDownload =
    useCallback(() => {
      if (
        downloadCloseTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          downloadCloseTimerRef.current,
        );
      }

      downloadCloseTimerRef.current =
        window.setTimeout(() => {
          closeMobileMenu();
          downloadCloseTimerRef.current = null;
        }, DOWNLOAD_CLOSE_DELAY);
    }, [closeMobileMenu]);

  return {
    activeSectionId,
    closeButtonRef,
    closeMobileMenu,
    handleResumeDownload,
    handleSectionLinkClick,
    isHeaderScrolled,
    isMobileMenuOpen,
    toggleButtonRef,
    toggleMobileMenu,
  };
}
