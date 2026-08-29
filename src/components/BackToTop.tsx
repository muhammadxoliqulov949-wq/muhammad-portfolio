"use client";

import Icon from "./ui/Icon";
import { t, type Locale } from "@/lib/i18n-core";

export default function BackToTop({ locale = "uz" }: { locale?: Locale }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn btn--ghost btn--sm"
    >
      <Icon name="arrow-up" size={14} />
      {t(locale, "footer.top")}
    </button>
  );
}
