import Link from "next/link";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  /** hover/pressed effekti kerak bo'lmasa false */
  interactive?: boolean;
};

type Props = BaseProps & {
  href?: string;
  external?: boolean;
};

/**
 * Kart primitivi — barcha sirtlar bitta joydan boshqariladi (audit P1-8:
 * 41 ta hardcoded rgba va 79 ta arbitrary qiymat tarqalib ketgan edi).
 * `href` berilsa butun karta havolaga aylanadi, lekin ichidagi havolalar
 * ishlashi uchun "stretched link" usulidan foydalanamiz (invalid HTML
 * bo'lmagan holda butun karta bosiladigan).
 */
export default function Card({ children, className = "", href, external, interactive = true }: Props) {
  const cls = `card relative block ${interactive ? "card--hover" : "card--flat"} ${className}`;

  if (href) {
    const isExternal = external ?? /^https?:/i.test(href);
    const common = { className: cls };
    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        {children}
      </a>
    ) : (
      <Link href={href} {...common}>
        {children}
        <span className="sr-only">Batafsil</span>
      </Link>
    );
  }

  return <div className={cls}>{children}</div>;
}
