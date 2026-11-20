export type ViewPoint = {
  createdAt: Date;
  path: string;
  referrer: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  visitorId: string;
  anonymous: boolean;
  anonHash: string;
  sessionId: string;
};

export function topCounts(values: string[], limit = 6) {
  const map = new Map<string, number>();
  for (const value of values) {
    const key = value || "—";
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function seriesByDay(views: { createdAt: Date }[], days: number, now = new Date()) {
  const buckets: { day: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    buckets.push({ day: date.toISOString().slice(0, 10), count: 0 });
  }
  const index = new Map(buckets.map((bucket, i) => [bucket.day, i]));
  for (const view of views) {
    const key = view.createdAt.toISOString().slice(0, 10);
    const slot = index.get(key);
    if (slot !== undefined) buckets[slot].count += 1;
  }
  return buckets;
}

export function uniqueKeys(views: ViewPoint[]) {
  const people = new Set<string>();
  for (const view of views) {
    if (!view.anonymous && view.visitorId) people.add(`v:${view.visitorId}`);
    else if (view.anonHash) people.add(`a:${view.anonHash}`);
  }
  return people.size;
}

export function liveCount(views: ViewPoint[], now = new Date()) {
  const cutoff = now.getTime() - 5 * 60 * 1000;
  const keys = new Set<string>();
  for (const view of views) {
    if (view.createdAt.getTime() < cutoff) continue;
    keys.add(view.sessionId || view.visitorId || view.anonHash || view.path);
  }
  return keys.size;
}
