import { Archive, Briefcase, Download, MailOpen, MapPin } from "lucide-react";
import Link from "next/link";
import { createOpening, deleteOpening, setApplicationStatus } from "@/app/admin/actions";
import { getPrisma } from "@/lib/db";

const statusLabel: Record<string, string> = {
  NEW: "Nouveau",
  READ: "Lu",
  ARCHIVED: "Archivé",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const db = getPrisma();
  if (!db) return <p>Base de données indisponible.</p>;
  const status = sp.status === "READ" || sp.status === "ARCHIVED" || sp.status === "NEW" ? sp.status : undefined;
  const [rows, openings, unread] = await Promise.all([
    db.jobApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.jobOpening.findMany({ orderBy: { order: "asc" } }),
    db.jobApplication.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div className="inbox">
      <header className="dash-head">
        <div>
          <p className="dash-kicker">Recrutement</p>
          <h1>Candidatures</h1>
          <p className="dash-sub">
            {rows.length.toLocaleString("fr-DZ")} candidature{rows.length > 1 ? "s" : ""}
            {unread > 0 ? ` · ${unread} non lue${unread > 1 ? "s" : ""}` : ""}
          </p>
        </div>
      </header>

      <nav className="seg inbox-seg" aria-label="Statut">
        {(
          [
            ["", "Toutes"],
            ["NEW", "Nouvelles"],
            ["READ", "Lues"],
            ["ARCHIVED", "Archivées"],
          ] as const
        ).map(([value, label]) => {
          const active = (sp.status || "") === value;
          const href = value ? `/admin/candidatures?status=${value}` : "/admin/candidatures";
          return (
            <Link key={value || "all"} href={href} className={active ? "is-on" : undefined} aria-current={active ? "page" : undefined}>
              {label}
            </Link>
          );
        })}
      </nav>

      {rows.length === 0 ? (
        <div className="dash-panel">
          <p className="dash-empty">Aucune candidature pour ces filtres.</p>
        </div>
      ) : (
        <ul className="inbox-list">
          {rows.map((row) => (
            <li key={row.id} className={`inbox-item${row.status === "NEW" ? " is-new" : ""}`}>
              <div className="inbox-item-top">
                <div className="inbox-who">
                  <span className="inbox-avatar is-job" aria-hidden>
                    <Briefcase size={16} />
                  </span>
                  <div>
                    <strong>{row.name}</strong>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </div>
                </div>
                <div className="inbox-flags">
                  <span className="admin-badge is-service">{row.position}</span>
                  <span className={`admin-badge is-${row.status.toLowerCase()}`}>{statusLabel[row.status] || row.status}</span>
                  <time className="dash-time" dateTime={row.createdAt.toISOString()}>
                    {row.createdAt.toLocaleString("fr-DZ")}
                  </time>
                </div>
              </div>

              <div className="inbox-meta">
                {row.phone ? <span>{row.phone}</span> : null}
              </div>

              {row.message ? <p className="inbox-body">{row.message}</p> : null}

              <div className="inbox-actions">
                {row.cvUrl ? (
                  <a className="admin-btn is-outline is-sm" href={row.cvUrl} target="_blank" rel="noreferrer">
                    <Download size={14} /> CV
                  </a>
                ) : null}
                <a className="admin-btn is-outline is-sm" href={`mailto:${row.email}`}>
                  Répondre
                </a>
                {row.status !== "READ" ? (
                  <form action={setApplicationStatus.bind(null, row.id, "READ")}>
                    <button className="admin-btn is-outline is-sm" type="submit">
                      <MailOpen size={14} /> Lu
                    </button>
                  </form>
                ) : null}
                {row.status !== "ARCHIVED" ? (
                  <form action={setApplicationStatus.bind(null, row.id, "ARCHIVED")}>
                    <button className="admin-btn is-outline is-sm" type="submit">
                      <Archive size={14} /> Archiver
                    </button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <section className="dash-panel openings">
        <header>
          <h2>Postes ouverts</h2>
          <span>{openings.length}</span>
        </header>
        <form action={createOpening} className="openings-form">
          <input name="title" placeholder="Intitulé du poste" required />
          <input name="location" placeholder="Lieu" defaultValue="Jijel" />
          <textarea name="description" placeholder="Description (optionnel)" rows={3} />
          <button className="admin-btn" type="submit">
            Publier
          </button>
        </form>
        {openings.length === 0 ? (
          <p className="dash-empty" style={{ minHeight: 80 }}>
            Aucun poste publié.
          </p>
        ) : (
          <ul className="openings-list">
            {openings.map((job) => (
              <li key={job.id}>
                <div>
                  <strong>{job.title}</strong>
                  <span>
                    <MapPin size={13} /> {job.location}
                  </span>
                </div>
                <form action={deleteOpening.bind(null, job.id)}>
                  <button className="admin-btn is-danger is-sm" type="submit">
                    Retirer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
