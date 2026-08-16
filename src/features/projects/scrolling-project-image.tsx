"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";

export function ScrollingProjectImage({ src, alt }: Readonly<{ src: string; alt: string }>) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(false);

  const measure = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const frame = frameRef.current;
    if (!frame || !image.naturalWidth || !image.naturalHeight) return;
    const renderedHeight = image.naturalHeight * (frame.clientWidth / image.naturalWidth);
    setDistance(Math.max(0, Math.round(renderedHeight - frame.clientHeight)));
  }, []);

  const style = {
    "--project-scroll-distance": `${distance}px`,
    "--project-scroll-duration": `${Math.min(18, Math.max(5, distance / 145))}s`,
  } as CSSProperties;

  return (
    <div
      ref={frameRef}
      className={`project-scroll-shot${active ? " is-scrolling" : ""}${distance <= 0 ? " is-static" : ""}`}
      style={style}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(true); }}
      onPointerLeave={() => setActive(false)}
      onPointerDown={(event) => { if (event.pointerType !== "mouse") setActive(true); }}
      onPointerUp={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={2400}
        sizes="(max-width: 760px) 92vw, 33vw"
        unoptimized
        draggable={false}
        onLoad={measure}
      />
      <span className="project-scroll-shot__hint" aria-hidden="true">برای نمایش کامل، نگه دارید</span>
    </div>
  );
}
