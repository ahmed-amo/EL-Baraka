import type { Prisma } from "@prisma/client";
import { Archive, Mail, MailOpen, Reply, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteMessage, retryMessage, setMessageStatus } from "@/app/admin/actions";
import { getPrisma } from "@/lib/db";

const statusLabel: Record<string, string> = {
  NEW: "Nouveau",
  READ: "Lu",
  ARCHIVED: "Archivé",
};

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const sp = await searchParams;
  const db = getPrisma();
  if (!db) return <p>Base de données indisponible.</p>;
  const status = sp.status === "READ" || sp.status === "ARCHIVED" || sp.status === "NEW" ? sp.status : undefined;
  const where: Prisma.ContactMessageWhereInput = {
    ...(status ? { status } : {}),
    ...(sp.q
      ? {
            OR: [
              { name: { contains: sp.q } },
              { email: { contains: sp.q } },
              { company: { contains: sp.q } },
              { city: { contains: sp.q } },
              { message: { contains: sp.q } },
            ],
        }
      : {}),
  };
  const [rows, total, unread] = await Promise.all([
    db.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 }),
    db.contactMessage.count({ where }),
    db.contactMessage.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div className="inbox">
      <header className="dash-head">
        <div>
          <p className="dash-kicker">Boîte de réception</p>
          <h1>Messages</h1>
          <p className="dash-sub">
            {total.toLocaleString("fr-DZ")} message{total > 1 ? "s" : ""}
            {unread > 0 ? ` · ${unread} non lu${unread > 1 ? "s" : ""}` : ""}
          </p>
        </div>
      </header>

      <form className="inbox-toolbar" action="/admin/messages">
        <input name="q" defaultValue={sp.q || ""} placeholder="Nom, e-mail, société, ville…" type="search" />
        <nav className="seg" aria-label="Statut">
          {(
            [
              ["", "Tous"],
              ["NEW", "Nouveaux"],
              ["READ", "Lus"],
              ["ARCHIVED", "Archivés"],
            ] as const
          ).map(([value, label]) => {
            const active = (sp.status || "") === value;
            const href = value
              ? `/admin/messages?status=${value}${sp.q ? `&q=${encodeURIComponent(sp.q)}` : ""}`
              : `/admin/messages${sp.q ? `?q=${encodeURIComponent(sp.q)}` : ""}`;
            return (
              <Link key={value || "all"} href={href} className={active ? "is-on" : undefined} aria-current={active ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <button className="admin-btn" type="submit">
          Rechercher
        </button>
      </form>

      {rows.length === 0 ? (
        <div className="dash-panel">
          <p className="dash-empty">Aucun message pour ces filtres.</p>
        </div>
      ) : (
        <ul className="inbox-list">
          {rows.map((row) => (
            <li key={row.id} className={`inbox-item${row.status === "NEW" ? " is-new" : ""}`}>
              <div className="inbox-item-top">
                <div className="inbox-who">
                  <span className="inbox-avatar" aria-hidden>
                    {row.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div>
                    <strong>{row.name}</strong>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </div>
                </div>
                <div className="inbox-flags">
                  <span className={`admin-badge is-${row.status.toLowerCase()}`}>{statusLabel[row.status] || row.status}</span>
                  <span className={`admin-badge ${row.emailSent ? "is-ok" : "is-warn"}`}>
                    {row.emailSent ? "E-mail envoyé" : "E-mail en échec"}
                  </span>
                  <time className="dash-time" dateTime={row.createdAt.toISOString()}>
                    {row.createdAt.toLocaleString("fr-DZ")}
                  </time>
                </div>
              </div>

              <div className="inbox-meta">
                {row.phone ? <span>{row.phone}</span> : null}
                {row.company ? <span>{row.company}</span> : null}
                {row.city ? <span>{row.city}</span> : null}
                {row.service ? <span className="inbox-service">{row.service}</span> : null}
              </div>

              <p className="inbox-body">{row.message}</p>

              <div className="inbox-actions">
                <a className="admin-btn is-outline is-sm" href={`mailto:${row.email}`}>
                  <Reply size={14} /> Répondre
                </a>
                {row.status !== "READ" ? (
                  <form action={setMessageStatus.bind(null, row.id, "READ")}>
                    <button className="admin-btn is-outline is-sm" type="submit">
                      <MailOpen size={14} /> Lu
                    </button>
                  </form>
                ) : null}
                {row.status !== "ARCHIVED" ? (
                  <form action={setMessageStatus.bind(null, row.id, "ARCHIVED")}>
                    <button className="admin-btn is-outline is-sm" type="submit">
                      <Archive size={14} /> Archiver
                    </button>
                  </form>
                ) : (
                  <form action={setMessageStatus.bind(null, row.id, "NEW")}>
                    <button className="admin-btn is-outline is-sm" type="submit">
                      <Mail size={14} /> Rouvrir
                    </button>
                  </form>
                )}
                {!row.emailSent ? (
                  <form action={retryMessage.bind(null, row.id)}>
                    <button className="admin-btn is-sm" type="submit">
                      <RotateCcw size={14} /> Renvoyer
                    </button>
                  </form>
                ) : null}
                <form action={deleteMessage.bind(null, row.id)}>
                  <button className="admin-btn is-danger is-sm" type="submit">
                    <Trash2 size={14} /> Supprimer
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
