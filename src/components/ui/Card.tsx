import type { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type BaseProps = {
  children: ReactNode;
  className?: string;
  /** hover/pressed effekti kerak bo'lmasa false */
  interactive?: boolean;
  hitLabel?: string;
};

type Props = BaseProps & {
  href?: string;
  external?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "href">;

/**
 * Kart primitivi.
 * `href` berilsa butun karta bosiladigan — lekin tashqi `<a>` o'ramaydi.
 * Ichidagi demo/GitHub havolalari nested anchor bo'lmasin deb stretched-link
 * (`card__hit`) ishlatiladi.
 */
export default function Card({
  children,
  className = "",
  href,
  external,
  interactive = true,
  hitLabel = "Details",
  ...rest
}: Props) {
  const cls = `card relative block ${interactive ? "card--hover" : "card--flat"} ${className}`;

  if (href) {
    const isExternal = external ?? /^https?:/i.test(href);
    const hit = isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="card__hit">
        <span className="sr-only">{hitLabel}</span>
      </a>
    ) : (
      <Link href={href} className="card__hit">
        <span className="sr-only">{hitLabel}</span>
      </Link>
    );
    return (
      <div className={cls} {...rest}>
        {hit}
        {children}
      </div>
    );
  }

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
