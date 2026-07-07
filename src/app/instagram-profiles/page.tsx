import { getAnalyses } from "@/lib/db/analysis";
import { InstagramProfilesClient } from "./instagram-profiles-client";

export const dynamic = "force-dynamic";

export default async function InstagramProfilesPage() {
  const analyses = await getAnalyses();

  return <InstagramProfilesClient analyses={analyses} />;
}
