"use client";

import {
  useEffect,
  useRef,
} from "react";

import { GALLERY_MARQUEE_CONFIG } from "./gallery.constants";
import type { GalleryDirection } from "./gallery.types";

const CLONE_ATTRIBUTE = "data-gallery-clone";

function isHTMLElement(
  element: Element,
): element is HTMLElement {
  return element instanceof HTMLElement;
}

export function useGalleryMarquee(
  direction: GalleryDirection,
) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
  const currentRowElement = rowRef.current;
  const currentTrackElement = trackRef.current;

  if (
    currentRowElement === null ||
    currentTrackElement === null
  ) {
    return;
  }

  const rowElement: HTMLDivElement =
    currentRowElement;

  const trackElement: HTMLUListElement =
    currentTrackElement;

    const originalItems = Array.from(
      trackElement.children,
    ).filter(
      (element): element is HTMLElement =>
        isHTMLElement(element) &&
        element.getAttribute(CLONE_ATTRIBUTE) !== "true",
    );

    if (originalItems.length === 0) {
      return;
    }

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let prefersReducedMotion =
      motionPreference.matches;

    const directionMultiplier =
      direction === "right" ? 1 : -1;

    let position = 0;
    let periodWidth = 1;
    let isPaused = false;
    let isDragging = false;
    let pointerId: number | null = null;
    let dragStartX = 0;
    let dragStartPosition = 0;
    let lastPointerX = 0;
    let lastPointerTime = 0;
    let velocity = 0;
    let previousAnimationTime = 0;
    let animationFrameId = 0;
    let resizeTimerId: number | undefined;

    function removeClones() {
      trackElement
        .querySelectorAll<HTMLElement>(
          `[${CLONE_ATTRIBUTE}="true"]`,
        )
        .forEach((clone) => {
          clone.remove();
        });
    }

    function measureAndClone() {
      removeClones();

      const computedStyle =
        window.getComputedStyle(trackElement);

      const gap =
        Number.parseFloat(
          computedStyle.columnGap ||
            computedStyle.gap,
        ) || 0;

      let measuredPeriod = 0;

      originalItems.forEach((item) => {
        measuredPeriod +=
          item.getBoundingClientRect().width + gap;
      });

      measuredPeriod -= gap;

      periodWidth =
        measuredPeriod > 0
          ? measuredPeriod
          : 1;

      const viewportWidth =
        rowElement.getBoundingClientRect().width ||
        window.innerWidth;

      const requiredSets = Math.max(
        2,
        Math.ceil(
          (viewportWidth * 2) / periodWidth,
        ) + 1,
      );

      for (
        let setIndex = 0;
        setIndex < requiredSets;
        setIndex += 1
      ) {
        originalItems.forEach((item) => {
          const clone =
            item.cloneNode(true) as HTMLElement;

          clone.setAttribute(
            CLONE_ATTRIBUTE,
            "true",
          );

          clone.setAttribute(
            "aria-hidden",
            "true",
          );

          clone.tabIndex = -1;

          trackElement.appendChild(clone);
        });
      }
    }

    function applyTransform() {
      trackElement.style.transform =
        `translate3d(${position}px, 0, 0)`;
    }

    function wrapPosition() {
      if (periodWidth <= 0) {
        return;
      }

      while (position <= -periodWidth) {
        position += periodWidth;
      }

      while (position > 0) {
        position -= periodWidth;
      }
    }

    function updateMarquee(delta: number) {
      if (isPaused || isDragging) {
        return;
      }

      if (
        Math.abs(velocity) >
        GALLERY_MARQUEE_CONFIG.minimumVelocity
      ) {
        position += velocity * delta;

        velocity *= Math.pow(
          GALLERY_MARQUEE_CONFIG.friction,
          delta * 60,
        );

        if (
          Math.abs(velocity) <=
          GALLERY_MARQUEE_CONFIG.minimumVelocity
        ) {
          velocity = 0;
        }
      }
      else if (!prefersReducedMotion) {
        position +=
          directionMultiplier *
          GALLERY_MARQUEE_CONFIG.baseSpeed *
          delta;
      }

      wrapPosition();
      applyTransform();
    }

    function runAnimation(timestamp: number) {
      if (!previousAnimationTime) {
        previousAnimationTime = timestamp;
      }

      let delta =
        (timestamp - previousAnimationTime) /
        1000;

      previousAnimationTime = timestamp;

      delta = Math.min(
        delta,
        GALLERY_MARQUEE_CONFIG.maximumDelta,
      );

      updateMarquee(delta);

      animationFrameId =
        window.requestAnimationFrame(
          runAnimation,
        );
    }

    function handleMouseEnter() {
      isPaused = true;
    }

    function handleMouseLeave() {
      if (!isDragging) {
        isPaused = false;
      }
    }

    function handlePointerDown(
      event: PointerEvent,
    ) {
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      isDragging = true;
      isPaused = true;
      velocity = 0;
      pointerId = event.pointerId;

      if (
        typeof rowElement.setPointerCapture ===
        "function"
      ) {
        rowElement.setPointerCapture(pointerId);
      }

      dragStartX = event.clientX;
      dragStartPosition = position;
      lastPointerX = event.clientX;
      lastPointerTime = performance.now();

      rowElement.classList.add("is-dragging");
    }

    function handlePointerMove(
      event: PointerEvent,
    ) {
      if (
        !isDragging ||
        event.pointerId !== pointerId
      ) {
        return;
      }

      const deltaX =
        event.clientX - dragStartX;

      position =
        dragStartPosition + deltaX;

      wrapPosition();
      applyTransform();

      const currentTime = performance.now();

      const elapsedSeconds =
        (currentTime - lastPointerTime) /
        1000;

      if (elapsedSeconds > 0) {
        velocity =
          (event.clientX - lastPointerX) /
          elapsedSeconds;
      }

      lastPointerX = event.clientX;
      lastPointerTime = currentTime;
    }

    function handlePointerEnd() {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      isPaused = false;

      rowElement.classList.remove("is-dragging");

      if (
        pointerId !== null &&
        typeof rowElement.hasPointerCapture ===
          "function" &&
        rowElement.hasPointerCapture(pointerId)
      ) {
        try {
          rowElement.releasePointerCapture(pointerId);
        }
        catch {
          // Pointer capture may already be released.
        }
      }

      pointerId = null;
    }

    function handleResize() {
      const previousPeriod = periodWidth;

      const positionRatio = previousPeriod
        ? position / previousPeriod
        : 0;

      measureAndClone();

      position =
        positionRatio * periodWidth;

      wrapPosition();
      applyTransform();
    }

    function scheduleResize() {
      if (resizeTimerId !== undefined) {
        window.clearTimeout(resizeTimerId);
      }

      resizeTimerId = window.setTimeout(
        handleResize,
        GALLERY_MARQUEE_CONFIG
          .resizeDebounceMilliseconds,
      );
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        previousAnimationTime = 0;
      }
    }

    function handleMotionPreferenceChange(
      event: MediaQueryListEvent,
    ) {
      prefersReducedMotion = event.matches;
    }

    measureAndClone();

    position =
      direction === "left"
        ? -periodWidth *
          GALLERY_MARQUEE_CONFIG
            .leftInitialOffsetRatio
        : -periodWidth *
          GALLERY_MARQUEE_CONFIG
            .rightInitialOffsetRatio;

    applyTransform();

    rowElement.addEventListener(
      "mouseenter",
      handleMouseEnter,
    );

    rowElement.addEventListener(
      "mouseleave",
      handleMouseLeave,
    );

    rowElement.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    rowElement.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    rowElement.addEventListener(
      "pointerup",
      handlePointerEnd,
    );

    rowElement.addEventListener(
      "pointercancel",
      handlePointerEnd,
    );

    window.addEventListener(
      "resize",
      scheduleResize,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    motionPreference.addEventListener(
      "change",
      handleMotionPreferenceChange,
    );

    animationFrameId =
      window.requestAnimationFrame(
        runAnimation,
      );

    return () => {
      window.cancelAnimationFrame(
        animationFrameId,
      );

      if (resizeTimerId !== undefined) {
        window.clearTimeout(resizeTimerId);
      }

      rowElement.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );

      rowElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );

      rowElement.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      rowElement.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      rowElement.removeEventListener(
        "pointerup",
        handlePointerEnd,
      );

      rowElement.removeEventListener(
        "pointercancel",
        handlePointerEnd,
      );

      window.removeEventListener(
        "resize",
        scheduleResize,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      motionPreference.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );

      rowElement.classList.remove("is-dragging");

      removeClones();

      trackElement.style.transform = "";
    };
  }, [direction]);

  return {
    rowRef,
    trackRef,
  };
}