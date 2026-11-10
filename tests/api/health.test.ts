import { describe, expect, it } from "vitest";
import { DELETE, GET, PATCH, POST, PUT } from "@/app/api/health/route";

describe("/api/health", () => {
  it("answers ok with no-store and only the fields a probe needs", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const body = (await response.json()) as Record<string, unknown>;
    expect(Object.keys(body).sort()).toEqual(["status", "timestamp"]);
    expect(body.status).toBe("ok");
  });

  it("rejects every other verb with 405 and an Allow header", () => {
    for (const handler of [POST, PUT, PATCH, DELETE]) {
      const response = handler();
      expect(response.status).toBe(405);
      expect(response.headers.get("Allow")).toBe("GET, HEAD, OPTIONS");
    }
  });
});
