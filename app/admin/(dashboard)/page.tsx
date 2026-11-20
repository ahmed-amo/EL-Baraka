import { Activity, CalendarDays, CalendarRange, Download, Eye, Inbox, Radio, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { AnalyticsCharts } from "@/components/admin/charts";
import { getAnalytics } from "@/lib/analytics";

const ranges = [7, 30, 90] as const;

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const days = range === "7" ? 7 : range === "90" ? 90 : 30;
  const data = await getAnalytics(days);
  const cards: StatCard[] = [
    { label: "Aujourd'hui", value: data.today, hint: "visites", icon: Activity },
    { label: "7 jours", value: data.days7, hint: "visites", icon: CalendarDays },
    { label: "30 jours", value: data.days30, hint: "visites", icon: CalendarRange },
    { label: "Uniques", value: data.unique, hint: "sur la période", icon: Users },
    { label: "Pages vues", value: data.pageviews, hint: "sur la période", icon: Eye },
    { label: "Messages non lus", value: data.unread, hint: "à traiter", icon: Inbox, href: "/admin/messages", tone: data.unread > 0 ? "alert" : undefined },
    { label: "En direct", value: data.live, hint: "visiteurs actifs", icon: Radio, tone: data.live > 0 ? "live" : undefined },
  ];

  return (
    <div className="dash">
      <header className="dash-head">
        <div>
          <p className="dash-kicker">Tableau de bord</p>
          <h1>Aperçu</h1>
          <p className="dash-sub">Activité du site sur les {days} derniers jours.</p>
        </div>
        <div className="dash-actions">
          <nav className="seg" aria-label="Période">
            {ranges.map((value) => (
              <Link key={value} href={`/admin?range=${value}`} className={days === value ? "is-on" : undefined} aria-current={days === value ? "page" : undefined}>
                {value} jours
              </Link>
            ))}
          </nav>
          <a className="admin-btn is-outline" href={`/api/admin/export?range=${days}`}>
            <Download size={16} />
            Exporter
          </a>
        </div>
      </header>

      <section className="dash-stats" aria-label="Indicateurs">
        {cards.map((card) => (
          <Stat key={card.label} card={card} />
        ))}
      </section>

      <div className="dash-mix">
        <span className="dash-chip">
          Nouveaux <b>{data.newVisitors.toLocaleString("fr-DZ")}</b>
        </span>
        <span className="dash-chip">
          De retour <b>{data.returning.toLocaleString("fr-DZ")}</b>
        </span>
        {data.events.map((event) => (
          <span className="dash-chip" key={event.name}>
            {event.name} <b>{event.count.toLocaleString("fr-DZ")}</b>
          </span>
        ))}
      </div>

      <AnalyticsCharts data={data} />

      <div className="dash-split">
        <RankList title="Pays" rows={data.countries} />
        <RankList title="Provenances" rows={data.referrers} />
      </div>

      <section className="dash-panel">
        <header>
          <h2>Dernières visites</h2>
          <span>{data.recent.length.toLocaleString("fr-DZ")}</span>
        </header>
        {data.recent.length === 0 ? (
          <p className="dash-empty">Aucune visite sur cette période.</p>
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
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={`${row.createdAt}-${row.path}`}>
                    <td className="dash-time">
                      {new Date(row.createdAt).toLocaleString("fr-DZ", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="dash-path" title={row.path}>
                      {row.path}
                    </td>
                    <td>{row.country || "—"}</td>
                    <td>
                      <span className="admin-badge">{row.device || "—"}</span>
                    </td>
                    <td>{row.browser || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

type StatCard = {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  href?: string;
  tone?: "live" | "alert";
};

function Stat({ card }: { card: StatCard }) {
  const Icon = card.icon;
  const body = (
    <>
      <div className="dash-stat-top">
        <span className="dash-ico">
          <Icon size={16} />
        </span>
        <span>{card.label}</span>
        {card.tone === "live" ? <i className="dash-live-dot" aria-hidden /> : null}
      </div>
      <strong>{card.value.toLocaleString("fr-DZ")}</strong>
      <em>{card.hint}</em>
    </>
  );
  if (card.href) {
    return (
      <Link href={card.href} className={`dash-stat is-link${card.tone ? ` is-${card.tone}` : ""}`}>
        {body}
      </Link>
    );
  }
  return <article className={`dash-stat${card.tone ? ` is-${card.tone}` : ""}`}>{body}</article>;
}

function RankList({ title, rows }: { title: string; rows: { name: string; count: number }[] }) {
  const max = rows.reduce((peak, row) => Math.max(peak, row.count), 0) || 1;
  return (
    <section className="dash-panel">
      <header>
        <h2>{title}</h2>
        <span>{rows.length.toLocaleString("fr-DZ")}</span>
      </header>
      {rows.length === 0 ? (
        <p className="dash-empty">Aucune donnée sur cette période.</p>
      ) : (
        <ul className="dash-ranks">
          {rows.map((row) => (
            <li key={row.name}>
              <div className="dash-rank-row">
                <span>{row.name}</span>
                <strong>{row.count.toLocaleString("fr-DZ")}</strong>
              </div>
              <div className="dash-rank-track">
                <i style={{ width: `${Math.max(4, (row.count / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
