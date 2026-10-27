import type { MetadataRoute } from "next";

import { javneRute } from "@/lib/routes";
import { apsolutniUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** Sve javne strane (20), apsolutno i sa „/“ na kraju; bez dev-only `/stil/` i bez 404. */
export default function sitemap(): MetadataRoute.Sitemap {
  return javneRute().map((putanja) => ({ url: apsolutniUrl(putanja) }));
}
