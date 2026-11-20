function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor">
      <path d={d} />
    </svg>
  );
}

const items = [
  {
    key: "instagram" as const,
    label: "Instagram",
    d: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm5.25-1.35a1.05 1.05 0 1 0 1.05 1.05 1.05 1.05 0 0 0-1.05-1.05zM12 9a3 3 0 1 1-3 3 3 3 0 0 1 3-3z",
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    d: "M4.7 3.3A1.8 1.8 0 1 0 6.5 5.1 1.8 1.8 0 0 0 4.7 3.3zM3.2 8.2h3V20.7h-3zm5.1 0h2.9v1.7h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.7v7.7h-3v-6.8c0-1.6 0-3.7-2.3-3.7s-2.6 1.7-2.6 3.6v6.9h-3z",
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    d: "M14.5 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V3h-2.1C11.8 3 11 4.6 11 6.6v1.9H9v2.6h2V21h3.5v-9.9h2.3l.3-2.6z",
  },
];

export function SocialLinks({
  facebookUrl,
  linkedinUrl,
  instagramUrl,
  className = "socials",
}: {
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  className?: string;
}) {
  const hrefs = { facebook: facebookUrl, linkedin: linkedinUrl, instagram: instagramUrl };
  return (
    <div className={className}>
      {items.map((item) => {
        const href = hrefs[item.key].trim();
        const inner = <Icon d={item.d} />;
        return href ? (
          <a key={item.key} href={href} target="_blank" rel="noreferrer" aria-label={item.label}>
            {inner}
          </a>
        ) : (
          <span key={item.key} aria-label={item.label} title={item.label}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}
