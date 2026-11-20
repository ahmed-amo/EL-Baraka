import { describe, expect, it } from "vitest";
import { contactSchema, applicationSchema } from "@/lib/validators";
import { liveCount, seriesByDay, topCounts, uniqueKeys } from "@/lib/analytics-math";
import { anonymousHash, shouldIgnoreTrack } from "@/lib/privacy";

describe("contact schema", () => {
  it("accepts a valid message", () => {
    const parsed = contactSchema.safeParse({
      name: "Amina Benali",
      company: "Société exemple",
      phone: "021595959",
      email: "amina@exemple.dz",
      city: "Jijel",
      message: "Nous avons besoin d'un dispositif de gardiennage.",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a short message", () => {
    const parsed = contactSchema.safeParse({ name: "Ali", email: "ali@exemple.dz", message: "court" });
    expect(parsed.success).toBe(false);
  });
});

describe("application schema", () => {
  it("requires a position", () => {
    const parsed = applicationSchema.safeParse({
      name: "Karim Boudiaf",
      email: "karim@exemple.dz",
      phone: "0555000000",
      position: "Agent",
      message: "Je souhaite rejoindre vos équipes de gardiennage.",
    });
    expect(parsed.success).toBe(true);
  });
});

describe("analytics math", () => {
  const now = new Date("2026-10-29T12:00:00.000Z");
  const views = [
    {
      createdAt: new Date("2026-10-29T11:58:00.000Z"),
      path: "/",
      referrer: "",
      country: "DZ",
      device: "mobile",
      browser: "Chrome",
      os: "Android",
      visitorId: "a",
      anonymous: false,
      anonHash: "",
      sessionId: "s1",
    },
    {
      createdAt: new Date("2026-10-28T11:00:00.000Z"),
      path: "/contact",
      referrer: "direct",
      country: "DZ",
      device: "ordinateur",
      browser: "Firefox",
      os: "Windows",
      visitorId: "",
      anonymous: true,
      anonHash: "h1",
      sessionId: "",
    },
  ];

  it("counts uniques and live visitors", () => {
    expect(uniqueKeys(views)).toBe(2);
    expect(liveCount(views, now)).toBe(1);
    expect(topCounts(views.map((view) => view.path))[0]?.name).toBe("/");
    expect(seriesByDay(views, 3, now)).toHaveLength(3);
  });
});

describe("privacy", () => {
  it("ignores bots, admin and DNT", () => {
    expect(shouldIgnoreTrack({ ua: "Mozilla/5.0", dnt: "1", gpc: null, path: "/" })).toBe(true);
    expect(shouldIgnoreTrack({ ua: "Mozilla/5.0", dnt: null, gpc: "1", path: "/" })).toBe(true);
    expect(shouldIgnoreTrack({ ua: "Mozilla/5.0", dnt: null, gpc: null, path: "/admin" })).toBe(true);
    expect(shouldIgnoreTrack({ ua: "Googlebot", dnt: null, gpc: null, path: "/" })).toBe(true);
  });

  it("rotates the anonymous hash every day", () => {
    const first = anonymousHash("203.0.113.8", "Mozilla/5.0", "2026-10-29");
    const second = anonymousHash("203.0.113.8", "Mozilla/5.0", "2026-10-30");
    expect(first).not.toBe(second);
    expect(first).toHaveLength(64);
  });
});
