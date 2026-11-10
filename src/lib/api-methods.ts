/**
 * Rejection handler for the verbs an API route does not implement. RFC 9110
 * section 15.5.6 requires an Allow header on a 405; Next's auto fallback
 * carries none.
 */
export function methodNotAllowed(allow: string): () => Response {
  return () =>
    new Response(null, {
      status: 405,
      headers: { Allow: allow, "Cache-Control": "no-store" },
    });
}
