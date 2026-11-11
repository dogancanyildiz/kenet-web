import { serializeJsonLd } from "@/lib/structured-data";

/**
 * Inline structured data. A plain <script>, not next/script: it is a data
 * block, the browser never runs it, so CSP script-src does not apply to it.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
