import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const roots = ["app", "components", "content", "lib", "prisma"].map((dir) => path.join(process.cwd(), dir));

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return files(full);
    if (/\.(ts|tsx|json|css)$/.test(name)) return [full];
    return [];
  });
}

describe("client corrections", () => {
  it("does not keep the retired wording", () => {
    const blob = roots.flatMap((dir) => files(dir))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      .toLowerCase();
    expect(blob).not.toContain("25 ans");
    expect(blob).not.toContain("transfert");
    expect(blob).not.toContain("blind");
    expect(blob).not.toContain("incendie");
    expect(blob).not.toContain("60+");
  });
});
