"use client";

import Icon from "./ui/Icon";

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn btn--ghost btn--sm"
    >
      <Icon name="arrow-up" size={14} />
      Yuqoriga
    </button>
  );
}
