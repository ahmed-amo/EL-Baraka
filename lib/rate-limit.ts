const memory = new Map<string, number[]>();

function limitMemory(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (memory.get(key) || []).filter((stamp) => now - stamp < windowMs);
  if (hits.length >= limit) {
    memory.set(key, hits);
    return false;
  }
  hits.push(now);
  memory.set(key, hits);
  // Bound map size on a tiny Railway replica
  if (memory.size > 5000) {
    const oldest = memory.keys().next().value;
    if (oldest) memory.delete(oldest);
  }
  return true;
}

async function limitUpstash(key: string, limit: number, windowMs: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const redisKey = `eb:${key}`;
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["PEXPIRE", redisKey, windowMs, "NX"],
    ]),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { result?: number }[];
  const count = Number(data?.[0]?.result ?? 0);
  return count <= limit;
}

/**
 * Prefer Upstash, then in-process memory.
 * Avoid Postgres rate-limit rows — they cost more than the requests they protect on a small Railway box.
 */
export async function rateLimit(key: string, limit: number, windowMs: number) {
  try {
    const upstash = await limitUpstash(key, limit, windowMs);
    if (upstash !== null) return upstash;
  } catch (error) {
    console.error("rate-limit upstash", error);
  }
  return limitMemory(key, limit, windowMs);
}
