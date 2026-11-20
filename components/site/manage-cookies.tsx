"use client";

export function ManageCookies({ label }: { label: string }) {
  return (
    <button type="button" className="hover:text-white" onClick={() => window.dispatchEvent(new Event("eb:cookies"))}>
      {label}
    </button>
  );
}
