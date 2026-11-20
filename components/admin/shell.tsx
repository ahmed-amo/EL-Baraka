"use client";

import { Briefcase, Inbox, LayoutDashboard, LogOut, Menu, Settings, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Aperçu", icon: LayoutDashboard },
  { href: "/admin/visiteurs", label: "Visiteurs", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/candidatures", label: "Candidatures", icon: Briefcase },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`;
  return letters.toUpperCase() || "EB";
}

export function AdminShell({ name, email, children }: { name: string; email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("admin", open && "is-open")}>
      <button type="button" className="admin-scrim" aria-label="Fermer le menu" onClick={() => setOpen(false)} />
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand" onClick={() => setOpen(false)}>
          <Image src="/Elbaraka-Logo.png" alt="" width={92} height={92} />
          <span>
            <strong>El Baraka</strong>
            Administration
          </span>
        </Link>
        <p className="admin-nav-label">Navigation</p>
        <nav className="admin-nav" aria-label="Administration">
          {links.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn("admin-link", active && "is-on")} aria-current={active ? "page" : undefined}>
                <Icon size={18} strokeWidth={1.75} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <form action="/api/admin/logout" method="post">
          <button className="admin-logout" type="submit">
            <LogOut size={16} /> Déconnexion
          </button>
        </form>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <button type="button" className="admin-burger" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            <Menu size={18} />
          </button>
          <div className="admin-user">
            <span className="admin-avatar" aria-hidden>
              {initials(name)}
            </span>
            <span className="admin-user-meta">
              <strong>{name}</strong>
              <em>{email}</em>
            </span>
          </div>
        </header>
        <div className="admin-body">{children}</div>
      </div>
    </div>
  );
}
