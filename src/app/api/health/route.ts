import { NextResponse } from "next/server";
import { methodNotAllowed } from "@/lib/api-methods";

// Never prerendered, never cached: a cached 200 would keep reporting healthy
// after the process stopped answering.
export const dynamic = "force-dynamic";

/**
 * Public health signal for the Docker HEALTHCHECK and the uptime probe. The
 * body carries only the status and a timestamp; process details would hand a
 * passer by a free restart timeline.
 */
export function GET() {
  return NextResponse.json(
    { status: "ok", timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

const rejectMethod = methodNotAllowed("GET, HEAD, OPTIONS");
export {
  rejectMethod as POST,
  rejectMethod as PUT,
  rejectMethod as PATCH,
  rejectMethod as DELETE,
};
