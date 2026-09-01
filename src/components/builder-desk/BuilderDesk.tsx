"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BuilderDeskScene = dynamic(() => import("./BuilderDeskScene"), {
  ssr: false,
  loading: () => null,
});

type Theme = "light" | "dark";
type Quality = "desktop" | "mobile" | "fallback";

function StaticDeskPoster() {
  return (
    <div className="builder-desk-poster" aria-hidden="true">
      <div className="builder-desk-poster__grid" />
      <span className="builder-desk-poster__note builder-desk-poster__note--one" />
      <span className="builder-desk-poster__note builder-desk-poster__note--two" />
      <div className="builder-desk-poster__screen">
        <span />
        <span />
        <span />
      </div>
      <div className="builder-desk-poster__code">
        <i />
        <i />
        <i />
      </div>
      <span className="builder-desk-poster__seed" />
      <span className="builder-desk-poster__ring" />
      <div className="builder-desk-poster__project"><span /></div>
    </div>
  );
}

function detectQuality(): Quality {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return "fallback";

  try {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return "fallback";
  } catch {
    return "fallback";
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 2;
  const memory = nav.deviceMemory || 4;
  const mobileLayout = window.matchMedia("(max-width: 767px), (hover: none)").matches;
  if (cores < 4 || memory < 4) return "fallback";
  return mobileLayout ? "mobile" : "desktop";
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function BuilderDesk() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [quality, setQuality] = useState<Quality>("fallback");
  const [theme, setTheme] = useState<Theme>("dark");
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setTheme(currentTheme());
      setQuality(detectQuality());
      setReady(true);
    });

    const themeObserver = new MutationObserver(() => setTheme(currentTheme()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
      { rootMargin: "160px 0px", threshold: 0.01 },
    );
    if (rootRef.current) visibilityObserver.observe(rootRef.current);

    const onVisibility = () => {
      if (document.hidden) setVisible(false);
      else if (rootRef.current) {
        const rect = rootRef.current.getBoundingClientRect();
        setVisible(rect.bottom > -160 && rect.top < window.innerHeight + 160);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const renderScene = ready && visible && quality !== "fallback";

  return (
    <div
      ref={rootRef}
      className="builder-desk-frame hero-product"
      data-quality={quality}
      data-rendering={renderScene ? "webgl" : "static"}
      aria-hidden="true"
    >
      <StaticDeskPoster />
      {renderScene ? (
        <BuilderDeskScene theme={theme} quality={quality} onFailure={() => setQuality("fallback")} />
      ) : null}
      <div className="builder-desk-frame__label">
        <span>AI BUILDER&apos;S DESK</span>
        <span>IDEA → SHIP</span>
      </div>
    </div>
  );
}
