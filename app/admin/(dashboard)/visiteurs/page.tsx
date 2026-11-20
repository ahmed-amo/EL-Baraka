import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getPrisma } from "@/lib/db";

function qs(base: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  if (base.country) params.set("country", base.country);
  if (base.device) params.set("device", base.device);
  if (base.kind) params.set("kind", base.kind);
  if (page > 1) params.set("page", String(page));
  const s = params.toString();
  return s ? `/admin/visiteurs?${s}` : "/admin/visiteurs";
}

export default async function VisitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; country?: string; device?: string; kind?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page || 1));
  const db = getPrisma();
  if (!db) return <p>Base de données indisponible.</p>;
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const where = {
    ...(sp.country ? { country: sp.country } : {}),
    ...(sp.device ? { device: sp.device } : {}),
    ...(sp.kind === "new" ? { visitor: { firstSeen: { gte: since } } } : {}),
    ...(sp.kind === "returning" ? { visitor: { firstSeen: { lt: since } } } : {}),
  };
  const [rows, total] = await Promise.all([
    db.pageView.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 20,
      take: 20,
      include: { visitor: true },
    }),
    db.pageView.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / 20));
  const filters = { country: sp.country, device: sp.device, kind: sp.kind };

  return (
    <div className="inbox">
      <header className="dash-head">
        <div>
          <p className="dash-kicker">Trafic</p>
          <h1>Visiteurs</h1>
          <p className="dash-sub">
            {total.toLocaleString("fr-DZ")} visite{total > 1 ? "s" : ""} · page {page}/{pages}
          </p>
        </div>
      </header>

      <form className="inbox-toolbar" action="/admin/visiteurs">
        <input name="country" defaultValue={sp.country || ""} placeholder="Pays (ex. DZ)" />
        <select name="device" defaultValue={sp.device || ""}>
          <option value="">Tous les appareils</option>
          <option value="mobile">Mobile</option>
          <option value="ordinateur">Ordinateur</option>
          <option value="tablette">Tablette</option>
        </select>
        <select name="kind" defaultValue={sp.kind || ""}>
          <option value="">Tous les visiteurs</option>
          <option value="new">Nouveaux (30 j)</option>
          <option value="returning">De retour</option>
        </select>
        <button className="admin-btn" type="submit">
          Filtrer
        </button>
        {sp.country || sp.device || sp.kind ? (
          <Link className="admin-btn is-ghost is-sm" href="/admin/visiteurs">
            Réinitialiser
          </Link>
        ) : null}
      </form>

      <section className="dash-panel">
        {rows.length === 0 ? (
          <p className="dash-empty">Aucune visite pour ces filtres.</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Heure</th>
                  <th>Page</th>
                  <th>Pays</th>
                  <th>Appareil</th>
                  <th>Navigateur</th>
                  <th>Consentement</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const consent = row.anonymous ? "Anonyme" : row.visitor?.consent ? "Statistiques" : "Visiteur";
                  return (
                    <tr key={row.id}>
                      <td className="dash-time">{row.createdAt.toLocaleString("fr-DZ")}</td>
                      <td className="dash-path" title={row.path}>
                        {row.path}
                      </td>
                      <td>{row.country || "—"}</td>
                      <td>{row.device || "—"}</td>
                      <td>{row.browser || "—"}</td>
                      <td>
                        <span className={`admin-badge ${row.anonymous ? "is-muted" : row.visitor?.consent ? "is-ok" : ""}`}>
                          {consent}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="inbox-pager">
          {page > 1 ? (
            <Link className="admin-btn is-outline is-sm" href={qs(filters, page - 1)}>
              <ChevronLeft size={14} /> Précédent
            </Link>
          ) : (
            <span />
          )}
          <span>
            {page} / {pages}
          </span>
          {page < pages ? (
            <Link className="admin-btn is-outline is-sm" href={qs(filters, page + 1)}>
              Suivant <ChevronRight size={14} />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </section>
    </div>
  );
}
