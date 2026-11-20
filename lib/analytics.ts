import { getPrisma } from "./db";
import { liveCount, seriesByDay, topCounts, uniqueKeys, type ViewPoint } from "./analytics-math";

export type AnalyticsSnapshot = {
  today: number;
  days7: number;
  days30: number;
  unique: number;
  pageviews: number;
  unread: number;
  live: number;
  newVisitors: number;
  returning: number;
  series: { day: string; count: number }[];
  pages: { name: string; count: number }[];
  referrers: { name: string; count: number }[];
  countries: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  browsers: { name: string; count: number }[];
  systems: { name: string; count: number }[];
  events: { name: string; count: number }[];
  recent: {
    createdAt: string;
    path: string;
    country: string;
    device: string;
    browser: string;
    referrer: string;
  }[];
};

function empty(rangeDays: number): AnalyticsSnapshot {
  return {
    today: 0,
    days7: 0,
    days30: 0,
    unique: 0,
    pageviews: 0,
    unread: 0,
    live: 0,
    newVisitors: 0,
    returning: 0,
    series: seriesByDay([], rangeDays),
    pages: [],
    referrers: [],
    countries: [],
    devices: [],
    browsers: [],
    systems: [],
    events: [],
    recent: [],
  };
}

export async function getAnalytics(rangeDays: number): Promise<AnalyticsSnapshot> {
  const db = getPrisma();
  if (!db) return empty(rangeDays);
  const now = new Date();
  const since = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);
  const since30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  try {
    const [views, unread, events, visitors] = await Promise.all([
      db.pageView.findMany({
        where: { createdAt: { gte: since30 } },
        orderBy: { createdAt: "desc" },
        take: 8000,
      }),
      db.contactMessage.count({ where: { status: "NEW" } }),
      db.event.groupBy({
        by: ["name"],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      }),
      db.visitor.findMany({
        where: { lastSeen: { gte: since } },
        select: { visitorId: true, firstSeen: true },
      }),
    ]);

    const points: ViewPoint[] = views.map((view) => ({
      createdAt: view.createdAt,
      path: view.path,
      referrer: view.referrer,
      country: view.country,
      device: view.device,
      browser: view.browser,
      os: view.os,
      visitorId: view.visitorId || "",
      anonymous: view.anonymous,
      anonHash: view.anonHash,
      sessionId: view.sessionId,
    }));

    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);
    const start7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const inRange = points.filter((point) => point.createdAt >= since);
    const newIds = new Set(
      visitors.filter((visitor) => visitor.firstSeen >= since).map((visitor) => visitor.visitorId),
    );

    return {
      today: points.filter((point) => point.createdAt >= startToday).length,
      days7: points.filter((point) => point.createdAt >= start7).length,
      days30: points.length,
      unique: uniqueKeys(inRange),
      pageviews: inRange.length,
      unread,
      live: liveCount(points, now),
      newVisitors: newIds.size,
      returning: visitors.length - newIds.size,
      series: seriesByDay(inRange, rangeDays, now),
      pages: topCounts(inRange.map((point) => point.path)),
      referrers: topCounts(inRange.map((point) => point.referrer || "direct")),
      countries: topCounts(inRange.map((point) => point.country || "—")),
      devices: topCounts(inRange.map((point) => point.device || "—")),
      browsers: topCounts(inRange.map((point) => point.browser || "—")),
      systems: topCounts(inRange.map((point) => point.os || "—")),
      events: events.map((event) => ({ name: event.name, count: event._count._all })),
      recent: points.slice(0, 12).map((point) => ({
        createdAt: point.createdAt.toISOString(),
        path: point.path,
        country: point.country || "—",
        device: point.device || "—",
        browser: point.browser || "—",
        referrer: point.referrer || "direct",
      })),
    };
  } catch (error) {
    console.error("analytics", error);
    return empty(rangeDays);
  }
}
