"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";

const BuilderDeskStoryScene = dynamic(() => import("./BuilderDeskStoryScene"), {
  ssr: false,
  loading: () => null,
});

type Theme = "light" | "dark";
type Quality = "desktop" | "mobile" | "fallback";

const STAGES = [
  { id: "about", label: "PROTOTYPE" },
  { id: "skills", label: "CODE REVIEW" },
  { id: "experience", label: "TESTING" },
  { id: "work", label: "DEPLOY → REAL" },
] as const;

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function detectQuality(): Quality {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "fallback";

  try {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return "fallback";
  } catch {
    return "fallback";
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const mobile = window.matchMedia("(max-width: 767px), (hover: none)").matches;
  if ((nav.hardwareConcurrency || 2) < 4 || (nav.deviceMemory || 4) < 4) return "fallback";
  return mobile ? "mobile" : "desktop";
}

function StoryPoster({ stage }: { stage: number }) {
  return (
    <div className="builder-story-poster" data-stage={Math.round(stage)} aria-hidden="true">
      <span className="builder-story-poster__seed" />
      <span className="builder-story-poster__panel builder-story-poster__panel--one" />
      <span className="builder-story-poster__panel builder-story-poster__panel--two" />
      <span className="builder-story-poster__scan" />
      <span className="builder-story-poster__ring" />
    </div>
  );
}

export default function BuilderDeskStory({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [quality, setQuality] = useState<Quality>("fallback");
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState(0);
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
      { rootMargin: "120px 0px", threshold: 0.01 },
    );
    if (rootRef.current) visibilityObserver.observe(rootRef.current);

    const updateStage = () => {
      frameRef.current = null;
      if (!rootRef.current || document.hidden) return;
      const viewportAnchor = window.innerHeight * 0.48;
      const nodes = STAGES.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
      if (nodes.length === 0) return;

      let next = 0;
      for (let index = 0; index < nodes.length; index += 1) {
        const current = nodes[index].getBoundingClientRect();
        const following = nodes[index + 1]?.getBoundingClientRect();
        if (current.top <= viewportAnchor) {
          const end = following?.top ?? current.bottom;
          const distance = Math.max(end - current.top, 1);
          next = Math.min(index + Math.max(0, Math.min(1, (viewportAnchor - current.top) / distance)), STAGES.length);
        }
      }
      setStage((previous) => Math.abs(previous - next) > 0.004 ? next : previous);
    };

    const requestStageUpdate = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(updateStage);
    };
    const onVisibility = () => {
      if (document.hidden) setVisible(false);
      requestStageUpdate();
    };

    updateStage();
    window.addEventListener("scroll", requestStageUpdate, { passive: true });
    window.addEventListener("resize", requestStageUpdate, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", requestStageUpdate);
      window.removeEventListener("resize", requestStageUpdate);
      document.removeEventListener("visibilitychange", onVisibility);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const renderScene = ready && visible && quality !== "fallback";
  const stageIndex = Math.min(Math.floor(stage), STAGES.length - 1);

  return (
    <div
      ref={rootRef}
      className="builder-story"
      data-quality={quality}
      data-rendering={renderScene ? "webgl" : "static"}
      data-stage={stageIndex}
    >
      <aside className="builder-story__visual" aria-hidden="true">
        <div className="builder-story__frame">
          <StoryPoster stage={stage} />
          {renderScene ? (
            <BuilderDeskStoryScene
              theme={theme}
              quality={quality}
              stage={stage}
              onFailure={() => setQuality("fallback")}
            />
          ) : null}
          <div className="builder-story__status">
            <span>{String(stageIndex + 2).padStart(2, "0")}</span>
            <span>{STAGES[stageIndex].label}</span>
          </div>
        </div>
      </aside>
      <div className="builder-story__content">{children}</div>
    </div>
  );
}
