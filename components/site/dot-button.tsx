import { Link } from "@/i18n/navigation";

function Chevron({ size = 12 }: { size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} fill="none" aria-hidden>
      <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="#0b1d3a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DotButton({
  href,
  children,
  large = false,
  ghost = false,
  dark = false,
  light = false,
  type = "button",
  disabled = false,
}: {
  href?: string;
  children: React.ReactNode;
  large?: boolean;
  ghost?: boolean;
  dark?: boolean;
  light?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const className = `btn${large ? " lg" : ""}${ghost || dark ? " ghost" : ""}${dark ? " on-dark" : ""}${light ? " light" : ""}`;
  const inner = (
    <>
      <span className="lbl">{children}</span>
      <span className="dot">
        <Chevron size={large ? 16 : 12} />
      </span>
    </>
  );
  if (href?.startsWith("http")) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={className} disabled={disabled}>
      {inner}
    </button>
  );
}
